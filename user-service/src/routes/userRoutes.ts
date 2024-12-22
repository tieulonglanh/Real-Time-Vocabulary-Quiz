import { Request, Response, NextFunction, Router } from 'express';
const router = Router();

import { UserController } from 'controllers/userController';

const userController = new UserController();
// Định nghĩa các route
router.post('/users/validate', (req: Request, res: Response, next: NextFunction) => userController.validateUser(req, res, next));

export default router;