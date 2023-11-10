import { ExchangeCtr } from '@ctr';
import { Request, Response, Router } from 'express';
const router = Router()

router.get('/', async (req: Request, res: Response) => {
    const exchangeCtr = new ExchangeCtr()
    const result = await exchangeCtr.getCryptoPrice(req.headers.token, req.query)
    res.status(result.status).json({
        data: result.data,
        statusCode: result.code,
        devMessage: result.devMessage
    })
})

router.put('/update', async (req: Request, res: Response) => {
    const exchangeCtr = new ExchangeCtr()
    const result = await exchangeCtr.updateCurrencyPrice(req.headers.token, req.body)
    res.status(result.status).json({
        data: result.data,
        statusCode: result.code,
        devMessage: result.devMessage
    })
})

export default router