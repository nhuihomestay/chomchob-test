import { Router, Request, Response, NextFunction } from 'express';
import UserRoute from './user.route';
import ExchangeRoute from './exchange.route';
import AuthRoute from './auth.route';
import CryptoJS from 'crypto-js';

const AuthenToken = (req: Request, res: Response, next: NextFunction) => {
    const header: { token: string } = req.headers as { token: string }
    if (!header.token) {
        if (header.token === '') {
            return res.status(401)
                .json({
                    data: null,
                    devMessage: 'Unauthorized'
                })
        }
        next();
    } else if (header.token === '') {
        return res.status(401)
            .json({
                data: null,
                devMessage: 'Unauthorized'
            })
    } else {
        const tokenDecode = CryptoJS.AES.decrypt(header.token, process.env.SECRET_KEY || '').toString(CryptoJS.enc.Utf8)
        if (!tokenDecode || tokenDecode === null) {
            return res.status(401)
                .json({
                    data: null,
                    devMessage: 'Unauthorized'
                })
        }
        next();
    }

};

const router = Router();

router.use('/auth', AuthRoute)
router.use('/user', AuthenToken, UserRoute)
router.use('/exchange', AuthenToken, ExchangeRoute)

export default router;