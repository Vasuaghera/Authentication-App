import express from 'express';
import { isAuthenticated, login, logout, register, resetPassword, sendResetotp } from "../controllers/auth.js";
import { auth } from "../middleware/auth.js";
import passport from 'passport';

const router = express.Router();

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/isAuthenticated', auth, isAuthenticated);

// Password reset routes
router.post('/send-reset-otp', sendResetotp);
router.post('/reset-password', resetPassword);

// Google OAuth routes
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // Generate JWT token
        const token = req.user.getSignedJwtToken();
        
        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Send response to frontend
        res.send(`
            <script>
                window.opener.postMessage({ 
                    data: { 
                        success: true, 
                        message: 'Google login successful',
                        user: ${JSON.stringify(req.user)}
                    }
                }, '${process.env.FRONTEND_URL || 'http://localhost:5173'}');
            </script>
        `);
    }
);

export default router;