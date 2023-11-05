import { RequestHandler } from 'express';


export const test: RequestHandler = async (req, res, next) => {
    try {
        console.log('req.body:', req.body);
        console.log('req.user:', req.user);
        console.log('req.headers:', req.headers);


        return res.status(200).json({success: true}).end();
    } catch (error) {
        next(error);
    }
};

