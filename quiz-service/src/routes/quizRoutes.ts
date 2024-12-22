import { Request, Response, NextFunction, Router } from 'express';
const router = Router();

import  { AnswerController } from 'controllers/answerController';

// Định nghĩa các route
const answerController = new AnswerController();
router.post('/answers/validate', (req: Request, res: Response, next: NextFunction) => answerController.validateAnswer(req, res, next));

export default router;