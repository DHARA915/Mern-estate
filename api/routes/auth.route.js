import express from 'express';
import { signup,signin, google,updateAvatar } from '../controllers/auth.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google",google)

router.put('/update-avatar', verifyToken, updateAvatar);


export default router;
