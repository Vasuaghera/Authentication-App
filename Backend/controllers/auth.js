import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/user.js';
import transporter from '../config/nodemailer.js';

// Email Templates
const EMAIL_TEMPLATES = {
    welcome: (name, email) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4f46e5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 14px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Welcome to Authentication Web!</h1>
    </div>
    <div class="content">
        <p>Hi ${name},</p>
        <p>Thank you for registering with us. Your account has been successfully created.</p>
        <p><strong>Your Email:</strong> ${email}</p>
        <p>We're excited to have you on board!</p>
        <center>
            <a href="https://example.com" class="button">Get Started</a>
        </center>
    </div>
    <div class="footer">
        <p>© 2024 Authentication Web</p>
    </div>
</body>
</html>`,

    login: (name, time) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px; }
        .alert { background-color: #fee2e2; border-left: 4px solid #ef4444; padding: 10px; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 14px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>New Login Alert</h1>
    </div>
    <div class="content">
        <p>Hi ${name},</p>
        <p>We detected a new login to your account.</p>
        <p><strong>Login Time:</strong> ${time}</p>
        <div class="alert">
            <p>If this wasn't you, please secure your account immediately.</p>
        </div>
    </div>
    <div class="footer">
        <p>© 2024 Authentication Web</p>
    </div>
</body>
</html>`,

    otp: (name, otp) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px;
            background-color: #f9fafb;
        }
        .container {
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header { 
            background-color: #f59e0b; 
            color: white; 
            padding: 25px; 
            text-align: center; 
            border-radius: 8px 8px 0 0;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content { 
            background-color: #ffffff; 
            padding: 30px; 
            border-radius: 0 0 8px 8px;
        }
        .otp-container {
            background-color: #fff7ed;
            border: 2px dashed #f59e0b;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
            text-align: center;
        }
        .otp { 
            font-size: 36px; 
            font-weight: bold; 
            color: #f59e0b; 
            letter-spacing: 5px;
            margin: 15px 0;
        }
        .expiry {
            color: #666;
            font-size: 14px;
            margin-top: 10px;
        }
        .warning {
            background-color: #fef2f2;
            border-left: 4px solid #ef4444;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .footer { 
            text-align: center; 
            color: #666; 
            font-size: 14px; 
            margin-top: 30px;
            padding: 20px;
        }
        .divider {
            border-top: 1px solid #e5e7eb;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Your Verification Code</h1>
        </div>
        <div class="content">
            <p>Hi ${name},</p>
            <p>We received a request to verify your account. Please use the following verification code:</p>
            
            <div class="otp-container">
                <div class="otp">${otp}</div>
                <p class="expiry">This code will expire in 15 minutes</p>
            </div>

            <div class="warning">
                <p><strong>Important:</strong> Never share this code with anyone. Our team will never ask for this code.</p>
            </div>

            <div class="divider"></div>
            
            <p>If you didn't request this code, please ignore this email or contact support if you have concerns.</p>
        </div>
    </div>
    <div class="footer">
        <p>© 2024 Authentication Web</p>
        <p>This is an automated message, please do not reply to this email.</p>
    </div>
</body>
</html>`,

    passwordChange: (name) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #3b82f6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px; }
        .success { background-color: #dcfce7; border-left: 4px solid #22c55e; padding: 10px; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 14px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Password Changed Successfully</h1>
    </div>
    <div class="content">
        <p>Hi ${name},</p>
        <p>Your password has been successfully changed.</p>
        <div class="success">
            <p>If you didn't make this change, please contact us immediately.</p>
        </div>
    </div>
    <div class="footer">
        <p>© 2024 Authentication Web</p>
    </div>
</body>
</html>`
};

// For Registration
export const register = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        
        // Input validation
        if(!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Check if user exists
        const existingUser = await userModel.findOne({ email: email.toLowerCase() });
        if(existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        // Hash password
        const hashedPass = await bcrypt.hash(password, 10);
        
        // Create new user
        const newUser = new userModel({
            name,
            email: email.toLowerCase(),
            password: hashedPass
        });

        // Save user
        await newUser.save();

        // Generate token
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // Send immediate response
        res.status(201).json({
            success: true,
            message: 'Registration Successful'
        });

        // Send welcome email in background
        setImmediate(async () => {
            try {
                const mailOptions = {
                    from: `"Authentication Web" <${process.env.SMTP_USER}>`,
                    to: email,
                    subject: 'Welcome to Authentication Web',
                    html: EMAIL_TEMPLATES.welcome(name, email),
                    text: `Welcome ${name}! Thank you for registering with us. Your email is ${email}.`
                };

                console.log('Sending welcome email to:', email);
                const info = await transporter.sendMail(mailOptions);
                console.log('Welcome email sent successfully:', info.messageId);
            } catch (emailError) {
                console.error('Welcome email sending failed:', emailError);
            }
        });
    }
    catch(error) {
        console.error('Registration error:', error);
        return res.status(500).json({
            success: false,
            message: 'Registration failed. Please try again.'
        });
    }
};

// For Login
export const login = async (req, res) => {
    try {
        console.log('Login attempt for:', req.body.email);
        
        const { email, password } = req.body;

        // Check if email and password is entered by user
        if (!email || !password) {
            console.log('Missing email or password');
            return res.status(400).json({ 
                success: false, 
                message: 'Please enter email & password' 
            });
        }

        // Finding user in database with password field
        const user = await userModel.findOne({ email: email.toLowerCase() }).select('+password');
        console.log('User found:', user ? 'Yes' : 'No');

        if (!user) {
            console.log('Invalid email');
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid Email or Password' 
            });
        }

        // Check if password is correct
        try {
            console.log('Comparing passwords...');
            const isPasswordMatched = await bcrypt.compare(password, user.password);
            console.log('Password matched:', isPasswordMatched);

            if (!isPasswordMatched) {
                console.log('Invalid password');
                return res.status(401).json({ 
                    success: false, 
                    message: 'Invalid Email or Password' 
                });
            }
        } catch (passwordError) {
            console.error('Password comparison error:', passwordError);
            return res.status(500).json({
                success: false,
                message: 'Error comparing passwords'
            });
        }

        // Create JWT token
        try {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: '7d'
            });

            // Set cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            console.log('Token generated and cookie set successfully');

            res.status(200).json({
                success: true,
                message: 'Login successful',
                token,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email
                }
            });
        } catch (tokenError) {
            console.error('Token generation error:', tokenError);
            return res.status(500).json({
                success: false,
                message: 'Error generating authentication token'
            });
        }

        // Send login notification email in background
        setImmediate(async () => {
            try {
                const currentTime = new Date().toLocaleString();
                const mailOptions = {
                    from: `"Authentication Web" <${process.env.SMTP_USER}>`,
                    to: email,
                    subject: 'New Login Alert',
                    html: EMAIL_TEMPLATES.login(user.name, currentTime),
                    text: `Hi ${user.name}, we detected a new login to your account at ${currentTime}.`
                };

                console.log('Sending login notification to:', email);
                const info = await transporter.sendMail(mailOptions);
                console.log('Login notification sent successfully:', info.messageId);
            } catch (emailError) {
                console.error('Login notification email failed:', emailError);
            }
        });
    }
    catch(error) {
        console.error('Login error details:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error in login process',
            error: error.message 
        });
    }
};

// For Logout
export const logout = async (req, res) => {
    try {
        // Clear cookie
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
        });

        return res.json({
            success: true,
            message: "Logout Successfully"
        });
    }
    catch(error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};

// For checking if user is already authenticated or not
export const isAuthenticated = async (req, res) => {
    try {
        return res.json({
            success: true,
            message: "User authenticated"
        });
    }
    catch(error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};

// For send password reset OTP
export const sendResetotp = async (req, res) => {
    try {
        const { email } = req.body;
        console.log('Password reset requested for:', email);
        console.log('SMTP Configuration Status:', {
            SMTP_USER: process.env.SMTP_USER ? 'Set' : 'Not Set',
            SMTP_PASS: process.env.SMTP_PASS ? 'Set' : 'Not Set'
        });

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const user = await userModel.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log('Generated reset OTP:', otp);

        // Store OTP in user document using findOneAndUpdate
        const updatedUser = await userModel.findOneAndUpdate(
            { _id: user._id },
            {
                resetotp: otp,
                restotpExpireAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes expiry
            },
            { new: true, runValidators: false }
        );

        if (!updatedUser) {
            console.error('Failed to store reset OTP');
            return res.status(500).json({
                success: false,
                message: "Failed to generate OTP"
            });
        }

        console.log('Stored reset OTP:', otp);
        console.log('Reset OTP Expiry:', new Date(Date.now() + 15 * 60 * 1000));

        // Send email with OTP
        const mailOptions = {
            from: `"Authentication Web" <${process.env.SMTP_USER}>`,
            to: user.email,
            subject: 'Reset Password OTP',
            html: EMAIL_TEMPLATES.otp(user.name, otp),
            text: `Your OTP for resetting password is: ${otp}. This OTP will expire in 15 minutes.`
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            console.log('Reset OTP email sent successfully:', info.messageId);
        } catch (emailError) {
            console.error('Error sending reset OTP email:', emailError);
            throw emailError;
        }

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully to your email",
            otp: otp // For testing purposes only - remove in production
        });
    } catch (error) {
        console.error('Error in sendResetotp:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// For verification reset OTP and password reset
export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        console.log('Password reset attempt for:', email);

        if (!email || !otp || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required: email, otp, and new password"
            });
        }

        const user = await userModel.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        console.log('Stored reset OTP:', user.resetotp);
        console.log('Reset OTP Expiry:', user.restotpExpireAt);
        console.log('Current time:', new Date());

        if (!user.resetotp || !user.restotpExpireAt) {
            return res.status(400).json({
                success: false,
                message: "Please request a new OTP"
            });
        }

        if (user.restotpExpireAt < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired. Please request a new OTP"
            });
        }

        // Convert both OTPs to strings and trim whitespace
        const receivedOTP = otp.toString().trim();
        const storedOTP = user.resetotp.toString().trim();

        console.log('Comparing OTPs - Received:', receivedOTP, 'Stored:', storedOTP);
        console.log('OTP types - Received:', typeof receivedOTP, 'Stored:', typeof storedOTP);
        console.log('OTP lengths - Received:', receivedOTP.length, 'Stored:', storedOTP.length);

        if (receivedOTP !== storedOTP) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        console.log('New password hashed successfully');

        // Update user with new password and clear OTP fields
        const updatedUser = await userModel.findOneAndUpdate(
            { _id: user._id },
            {
                password: hashedPassword,
                resetotp: null,
                restotpExpireAt: null
            },
            { new: true, runValidators: false }
        );

        if (!updatedUser) {
            console.error('Failed to update user password');
            return res.status(500).json({
                success: false,
                message: "Failed to update password"
            });
        }

        console.log('Password updated successfully for user:', updatedUser.email);

        // Send password change notification
        try {
            const mailOptions = {
                from: `"Authentication Web" <${process.env.SMTP_USER}>`,
                to: email,
                subject: 'Password Changed Successfully',
                html: EMAIL_TEMPLATES.passwordChange(user.name),
                text: `Hi ${user.name}, your password has been successfully changed.`
            };

            await transporter.sendMail(mailOptions);
            console.log('Password change notification sent successfully');
        } catch (emailError) {
            console.error('Password change notification failed:', emailError);
        }

        return res.status(200).json({
            success: true,
            message: "Password reset successfully"
        });
    } catch (error) {
        console.error('Error in resetPassword:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
