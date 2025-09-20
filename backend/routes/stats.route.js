import { Router } from 'express'
import { dumpStats } from '../controllers/stats.controller.js';

const router = Router();

router.route('/get-details').get(dumpStats)

export default router