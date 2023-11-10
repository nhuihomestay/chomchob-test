import { UserDaos } from "@daos";
import { PERMISSION } from "src/constant/user.constant";
import CryptoJS from 'crypto-js';
import { DEV_MESSAGE } from "src/constant/devMessage.constant";

class UserCtr {
    public async getUser(token: any): Promise<any> {
        const tokenData: ITokenParse = this.checkToken(token)
        if (tokenData.username === '') {
            return {
                data: null,
                ...DEV_MESSAGE.ACCESS_DENIED
            }
        }
        const userDaos = new UserDaos();
        const queryData = await userDaos.queryUser({ username: tokenData.username })
        if (queryData.length === 0) {
            return {
                data: null,
                ...DEV_MESSAGE.ACCOUNT_NOT_FOUND
            }
        }

        const result = {
            username: queryData[0].username,
            wallet_address: queryData[0].wallet_address,
            balance: queryData[0].balance,
            permission: queryData[0].permission
        }
        return {
            data: result,
            ...DEV_MESSAGE.SUCCESS
        };
    }

    public async editBalance(token: any, body: IEditBalance): Promise<any> {
        const tokenData: ITokenParse = this.checkToken(token)
        if (tokenData.username === '' || tokenData.permission !== PERMISSION.ADMIN) {
            return {
                data: null,
                ...DEV_MESSAGE.ACCESS_DENIED
            }
        }

        const userDaos = new UserDaos();
        const updateData = await userDaos.editBalance(body)
        if (updateData.modifiedCount === 0) {
            return {
                data: null,
                ...DEV_MESSAGE.CANT_UPDATE
            }
        }

        return {
            data: {},
            ...DEV_MESSAGE.SUCCESS
        };
    }

    public async sendToken(token: any, body: ISendToken): Promise<any> {
        const tokenData: ITokenParse = this.checkToken(token)
        if (tokenData.username === '') {
            return {
                data: null,
                ...DEV_MESSAGE.ACCESS_DENIED
            }
        }
        const userDaos = new UserDaos();
        const reciverData = await userDaos.queryUser({ username: body.recipient })
        if (reciverData.length === 0) {
            return {
                data: null,
                ...DEV_MESSAGE.ACCOUNT_NOT_FOUND
            }
        }

        const updateData = await userDaos.tokenTransfer({
            sender: tokenData.username,
            ...body
        })

        if (updateData === 400103) {
            return {
                data: null,
                ...DEV_MESSAGE.NOT_ENOUGH_TOKEN
            }
        }

        if (updateData === 400104) {
            return {
                data: null,
                ...DEV_MESSAGE.CANT_UPDATE
            }
        }

        return {
            data: {
                total_balance: updateData
            },
            ...DEV_MESSAGE.SUCCESS
        };
    }

    private checkToken(token: String) {
        let tokenData: ITokenParse = {
            username: '',
            wallet_address: '',
            permission: ''
        }
        if (token) {
            const tokenDecode = CryptoJS.AES.decrypt(String(token), process.env.SECRET_KEY || '').toString(CryptoJS.enc.Utf8)
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

export default UserCtr;
