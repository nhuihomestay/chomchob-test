import { ExchangeDaos, UserDaos } from "@daos";
import { PERMISSION } from "src/constant/user.constant";
import CryptoJS from 'crypto-js';
import { DEV_MESSAGE } from "src/constant/devMessage.constant";

class ExchangeCtr {
    public async getCryptoPrice(token: any, query: any): Promise<any> {
        const tokenData: ITokenParse = this.checkToken(token)
        if (tokenData.username === '') {
            return {
                data: null,
                ...DEV_MESSAGE.ACCESS_DENIED
            }
        }
        const exchangeDaos = new ExchangeDaos();
        const queryData = await exchangeDaos.queryCurrency(query.cur_name ? { cur_name: query.cur_name } : {})
        return {
            data: queryData,
            ...DEV_MESSAGE.SUCCESS,
        };
    }

    public async updateCurrencyPrice(token: any, body: IUpdateCurrency): Promise<any> {
        const tokenData: ITokenParse = this.checkToken(token)
        if (tokenData.username === '' || tokenData.permission !== PERMISSION.ADMIN ) {
            return {
                data: null,
                ...DEV_MESSAGE.ACCESS_DENIED
            }
        }
        const exchangeDaos = new ExchangeDaos();
        const updateData = await exchangeDaos.updateCurrency(body)
        if (updateData.modifiedCount === 0) {
            return {
                data: {},
                ...DEV_MESSAGE.CANT_UPDATE
            }
        }
        return {
            data: {
                cur_name: body.cur_name,
                cur_price: body.cur_price
            },
            ...DEV_MESSAGE.SUCCESS
        }
    }

    private checkToken(token: String) {
        let tokenData: ITokenParse = {
            username: '',
            wallet_address: '',
            permission: ''
        }
        if (token) {
            const tokenDecode = CryptoJS.AES.decrypt(String(token) || '', process.env.SECRET_KEY || '').toString(CryptoJS.enc.Utf8)
            if (tokenDecode !== null) {
                const tokenParse = JSON.parse(tokenDecode)
                if (tokenParse) tokenData = {
                    username: tokenParse.username,
                    wallet_address: tokenParse.wallet_address,
                    permission: tokenParse.permission
                }
            }
        }
        return tokenData
    }
}

export default ExchangeCtr;
