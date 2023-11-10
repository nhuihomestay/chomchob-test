import { AuthCtr } from '@ctr';
import { Request, Response, Router } from 'express';
const router = Router()

router.post('/register', async (req: Request, res: Response) => {
    const authCtr = new AuthCtr()
    const result = await authCtr.register(req.body)
    res.status(result.status).json({
        data: result.data,
        statusCode: result.code,
        devMessage: result.devMessage
    })
})

router.post('/login', async (req: Request, res: Response) => {
    const authCtr = new AuthCtr()
    const result = await authCtr.login(req.body)
    res.status(result.status).json({
        data: result.data,
        statusCode: result.code,
        devMessage: result.devMessage
    })
})

export default router