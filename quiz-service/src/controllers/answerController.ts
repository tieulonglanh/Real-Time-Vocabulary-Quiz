import { Request, Response, NextFunction } from 'express';

// Lấy tất cả sản phẩm
const processAnswer = (req: Request, res: Response, next: NextFunction) => {
    try {
        res.status(200).json({
            "point": 20
        });
    } catch (error) {
        next(error); // Gửi lỗi cho middleware xử lý lỗi
    }
}

export default processAnswer;