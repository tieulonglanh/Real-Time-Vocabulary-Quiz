import { Request, Response, NextFunction } from 'express';

// get all users
const getUsers = (req: Request, res: Response, next: NextFunction) => {
    try {
        res.status(200).json({
            "users": [
                {
                    "id": 1,
                    "username": "tieulonglanh"
                },
                {
                    "id": 2,
                    "username": "tieulonglanh2"
                },
                {
                    "id": 3,
                    "username": "tieulonglanh3"
                },
                {
                    "id": 4,
                    "username": "tieulonglanh4"
                },
                {
                    "id": 5,
                    "username": "tieulonglanh5"
                }
            ]
        });
    } catch (error) {
        next(error); // Gửi lỗi cho middleware xử lý lỗi
    }
}

export default getUsers;