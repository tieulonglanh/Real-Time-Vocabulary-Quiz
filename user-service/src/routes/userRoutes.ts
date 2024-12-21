import { Router } from 'express';
const router = Router();

import  getUsers from 'controllers/userController';

// Định nghĩa các route
router.get('/users', getUsers);

export default router;