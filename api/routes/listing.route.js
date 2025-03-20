import express from 'express'
import { createlisting,deleteListing,updateListing ,getListing} from '../controllers/listing.controller.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/create',protect,createlisting)
router.delete('/delete/:id', protect, deleteListing)
router.post('/update/:id',protect,updateListing)
router.get('/get/:id',getListing)


export default router;