import {Router} from 'express'
import { complaintRegistered, viewComplains,  } from '../controllers/Complain.controller.js'
import { verifyUser } from '../middleware/auth.middleware.js'

const router = Router()

router.route('/loadge-complain').post(verifyUser, complaintRegistered)

router.route('/view-complain').get(viewComplains)



export default router