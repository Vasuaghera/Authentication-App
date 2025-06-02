import express from 'express';
import { getProfileDetails, updateProfileDetails } from '../controllers/profileController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Profile routes
router.get('/details', auth, getProfileDetails);
router.put('/update', auth, updateProfileDetails);

export default router; 