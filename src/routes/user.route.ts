import { UserCtr } from '@ctr';
import { Request, Response, Router } from 'express';
const router = Router()

router.get('/', async (req: Request, res: Response) => {
    const userCtr = new UserCtr()
    const result = await userCtr.getUser(req.headers.token)
    console.log(result)
    res.status(result.status).json({
        data: result.data,
        statusCode: result.code,
        devMessage: result.devMessage
    })
})

router.put('/edit', async (req: Request, res: Response) => {
    const userCtr = new UserCtr()
    const result = await userCtr.editBalance(req.headers.token, req.body)
    res.status(result.status).json({
        data: result.data,
        statusCode: result.code,
        devMessage: result.devMessage
    })
})

router.post('/send', async (req: Request, res: Response) => {
    const userCtr = new UserCtr()
    const result = await userCtr.sendToken(req.headers.token, req.body)
    res.status(result.status).json({
        data: result.data,
        statusCode: result.code,
        devMessage: result.devMessage
    })
})

export default router