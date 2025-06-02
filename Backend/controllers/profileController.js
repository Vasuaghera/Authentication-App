import User from '../models/user.js';
import { sendEmail } from '../utils/sendEmail.js';
import crypto from 'crypto';

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store OTP in user document
const storeOTP = async (userId, otp) => {
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
  await User.findByIdAndUpdate(userId, {
    otp,
    otpExpiry
  });
};

export const sendVerificationOTP = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: 'Email is already verified' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Generated OTP:', otp);
    
    // Store OTP directly in user document
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
    await user.save();
    
    console.log('Stored OTP:', user.otp);
    console.log('OTP Expiry:', user.otpExpiry);

    // Send email with OTP
    const message = `Your OTP for email verification is: ${otp}. This OTP will expire in 10 minutes.`;
    await sendEmail({
      email: user.email,
      subject: 'Email Verification OTP',
      message
    });

    console.log('OTP email sent successfully');

    res.status(200).json({ 
      success: true, 
      message: 'OTP sent successfully to your email',
      otp: otp // For testing purposes only - remove in production
    });
  } catch (error) {
    console.error('Error sending verification OTP:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyEmailWithOTP = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const { otp } = req.body;
    if (!otp) {
      return res.status(400).json({ success: false, message: 'Please provide OTP' });
    }

    console.log('Verifying OTP for user:', req.user._id);
    console.log('Received OTP:', otp);

    const user = await User.findById(req.user._id);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    console.log('Stored OTP:', user.otp);
    console.log('OTP Expiry:', user.otpExpiry);
    console.log('Current time:', new Date());
    console.log('Is OTP expired?', Date.now() > user.otpExpiry);

    if (user.isVerified) {
      console.log('User already verified');
      return res.status(400).json({ success: false, message: 'Email is already verified' });
    }

    if (!user.otp || !user.otpExpiry) {
      console.log('No OTP found or OTP expired');
      return res.status(400).json({ success: false, message: 'OTP expired or not found. Please request a new OTP.' });
    }

    if (Date.now() > user.otpExpiry) {
      console.log('OTP has expired');
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new OTP.' });
    }

    // Convert both OTPs to strings and trim whitespace
    const receivedOTP = otp.toString().trim();
    const storedOTP = user.otp.toString().trim();
    
    console.log('Comparing OTPs - Received:', receivedOTP, 'Stored:', storedOTP);
    console.log('OTP types - Received:', typeof receivedOTP, 'Stored:', typeof storedOTP);
    console.log('OTP lengths - Received:', receivedOTP.length, 'Stored:', storedOTP.length);

    if (receivedOTP !== storedOTP) {
      console.log('Invalid OTP - Received:', receivedOTP, 'Stored:', storedOTP);
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    // Mark email as verified and clear OTP
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    console.log('Email verified successfully');

    res.status(200).json({ 
      success: true, 
      message: 'Email verified successfully',
      user: {
        name: user.name,
        email: user.email,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// For getting user profile details
export const getProfileDetails = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).select('-password -resetotp');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user: {
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                gender: user.gender,
                address: user.address,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Error in getProfileDetails:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// For updating profile details
export const updateProfileDetails = async (req, res) => {
    try {
        const userId = req.user._id;
        const { 
            name, 
            phoneNumber, 
            gender, 
            address 
        } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Name is required"
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Update basic info
        user.name = name;
        user.phoneNumber = phoneNumber || user.phoneNumber;
        user.gender = gender || user.gender;

        // Update address if provided
        if (address) {
            user.address = {
                street: address.street || user.address.street,
                city: address.city || user.address.city,
                state: address.state || user.address.state,
                country: address.country || user.address.country,
                pincode: address.pincode || user.address.pincode
            };
        }

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                gender: user.gender,
                address: user.address
            }
        });
    } catch (error) {
        console.error('Error in updateProfileDetails:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}; 