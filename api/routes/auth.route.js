import express from 'express';
import { signup,signin, google,updateAvatar, signout } from '../controllers/auth.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google",google);
router.get("/signout",signout)

router.put('/update-avatar', verifyToken, updateAvatar);


export default router;
