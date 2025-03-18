import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/user.model.js';
import { updateProfile } from '../controllers/user.controller.js';
import { deleteUser } from '../controllers/user.controller.js';
import{getUserListing} from '../controllers/user.controller.js'

const router = express.Router();

router.put("/update/:id", protect,updateProfile);
router.delete('/delete/:id',protect,deleteUser);
router.get('/listing/:id',protect,getUserListing)




export default router;
