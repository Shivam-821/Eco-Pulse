import {Router} from 'express'
import {verifyUser} from '../middleware/auth.middleware.js'
import upload from '../middleware/multer.middleware.js'
import { createRecycle, getAllRecycle } from '../controllers/recycle.controller.js'


const router = Router()


router.route('/create-recycle').post(verifyUser, upload.single("image"), createRecycle)

router.route('/get-all-recycle').get(getAllRecycle)


export default router