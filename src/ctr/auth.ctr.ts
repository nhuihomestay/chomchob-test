import { UserDaos } from "@daos";
import bcrypt from 'bcrypt'
import CryptoJS from 'crypto-js';
import { DEV_MESSAGE } from "src/constant/devMessage.constant";

class AuthCtr {
    public async register(body: IAddUser): Promise<any> {
        const newPassword: string = await bcrypt.hash(String(body.password), 10)
        const userDaos = new UserDaos();
        const insertData = await userDaos.insertUser({
            username: body.username,
            password: newPassword
        })
        if (insertData === null) {
            return {
                data: null,
                ...DEV_MESSAGE.DUPLICATE_USERNAME
            }
        }
        return {
            data: {
                username: body.username
            },
            ...DEV_MESSAGE.SUCCESS,
        };
    }

    public async login(body: IAddUser): Promise<any> {
        const userDaos = new UserDaos();
        const authData = await userDaos.authUser({ username: body.username })
        if (authData.length === 0) {
            return {
                data: null,
                ...DEV_MESSAGE.ACCOUNT_NOT_FOUND
            }
        }

        const isAuth = await bcrypt.compare(String(body.password), authData[0].password)
        if (!isAuth) {
            return {
                data: null,
                ...DEV_MESSAGE.WRONG_PASSWORD
            }
        }

        const newToken: string = CryptoJS.AES.encrypt(JSON.stringify({
            username: authData[0].username,
            wallet_address: authData[0].wallet_address,
            permission: authData[0].permission
        }), process.env.SECRET_KEY || '').toString()

        return {
            data: {
                token: newToken
            },
            ...DEV_MESSAGE.SUCCESS,
        };
    }
}

export default AuthCtr