import { Request, Response, NextFunction } from 'express';

export class AnswerController {
    // Lấy tất cả sản phẩm
    validateAnswer(req: Request, res: Response, next: NextFunction)  {
        try {
            res.status(200).json({
                "data": true
            });
        } catch (error) {
            next(error); // Gửi lỗi cho middleware xử lý lỗi
        }
    }

}
