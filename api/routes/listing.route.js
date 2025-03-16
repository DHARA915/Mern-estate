import express from 'express'
import { createlisting } from '../controllers/listing.controller.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/create',protect,createlisting)

export default router;