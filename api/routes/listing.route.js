import express from 'express'
import { createlisting,deleteListing,updateListing } from '../controllers/listing.controller.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/create',protect,createlisting)
router.delete('/delete/:id', protect, deleteListing)
router.post('/update/:id',protect,updateListing)


export default router;