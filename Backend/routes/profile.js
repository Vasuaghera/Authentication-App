import express from 'express';
import { 
    getProfileDetails, 
    updateProfileDetails, 
    sendVerificationOTP, 
    verifyEmailWithOTP 
} from '../controllers/auth.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Profile routes
router.get('/details', isAuthenticated, getProfileDetails);
router.put('/update', isAuthenticated, updateProfileDetails);

// Email verification routes
router.post('/send-verification-otp', isAuthenticated, sendVerificationOTP);
router.post('/verify-email', isAuthenticated, verifyEmailWithOTP);

export default router; 