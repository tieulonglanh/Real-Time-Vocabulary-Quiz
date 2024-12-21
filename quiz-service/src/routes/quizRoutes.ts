import { Router } from 'express';
const router = Router();

import  processAnswer from 'controllers/answerController';

// Định nghĩa các route
router.post('/answer/process', processAnswer);

export default router;