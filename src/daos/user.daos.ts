import { MongoClient } from 'mongodb';
import { COLLECTION_NAME } from 'src/constant/db.constant';
import { PERMISSION } from 'src/constant/user.constant';
const collection = 'user'

class UserDaos {
    public async queryUser(option: any): Promise<any> {
        const client = new MongoClient(process.env.DATABASE_ENV || '');
        try {
            await client.connect()
            const selectDB = client.db(process.env.DATABASE_NAME || '')
            const data = await selectDB.collection(COLLECTION_NAME.USER).find(option).toArray()
            return data
        } catch (err: any) {
            console.log(err);
            return null
        } finally {
            client.close()
        }
    }

    public async insertUser(option: any): Promise<any> {
        const client = new MongoClient(process.env.DATABASE_ENV || '');
        try {
            await client.connect()
            const selectDB = client.db(process.env.DATABASE_NAME || '')
            const isDupplicateName = await selectDB.collection(COLLECTION_NAME.USER).find({ username: option.username }).toArray()
            if (isDupplicateName.length > 0) return null
            let newWallet = this.mockWallet()
            let isDupplicateWallet = await selectDB.collection(COLLECTION_NAME.USER).find({ wallet_address: newWallet }).toArray()
            while (isDupplicateWallet.length > 0) {
                newWallet = this.mockWallet()
                isDupplicateWallet = await selectDB.collection(COLLECTION_NAME.USER).find({ wallet_address: newWallet }).toArray()
            }
            const data = await selectDB.collection(COLLECTION_NAME.USER).insertOne({
                "username": option.username,
                "wallet_address": newWallet,
                "password": option.password,
                "balance": {
                    "USDT": 0.00,
                    "BTC": 0.00,
                    "ETH": 0.00,
                    "ARB": 0.00,
                    "OP": 0.00
                },
                "permission": PERMISSION.USER,
                "created_at": new Date(Date.now()).toISOString(),
                "updated_at": new Date(Date.now()).toISOString()
            })
            return data
        } catch (err: any) {
            console.log(err);
            return null
        } finally {
            client.close()
        }
    }

    public async editBalance(option: any): Promise<any> {
        const client = new MongoClient(process.env.DATABASE_ENV || '');
        try {
            await client.connect()
            const selectDB = client.db(process.env.DATABASE_NAME || '')
            const balance = Object.keys(option.balance).reduce(
                (acc, key) => ({ ...acc, [`balance.${key}`]: option.balance[key] }),
                {}
            )
            const data = await selectDB.collection(COLLECTION_NAME.USER).updateOne({ username: option.username }, {
                $set: {
                    ...balance,
                    updated_at: new Date(Date.now()).toISOString()
                }
            })

            return data
        } catch (err: any) {
            console.log(err);
            return null
        } finally {
            client.close()
        }
    }

    public async authUser(option: any): Promise<any> {
        const client = new MongoClient(process.env.DATABASE_ENV || '');
        try {
            await client.connect()
            const selectDB = client.db(process.env.DATABASE_NAME || '')
            const data = await selectDB.collection(COLLECTION_NAME.USER).find({ username: option.username }).toArray()
            return data
        } catch (err: any) {
            console.log(err);
            return null
        } finally {
            client.close()
        }
    }

    public async tokenTransfer(option: any): Promise<any> {
        const client = new MongoClient(process.env.DATABASE_ENV || '');
        try {
            await client.connect()
            const selectDB = client.db(process.env.DATABASE_NAME || '')
            const senderData = await selectDB.collection(COLLECTION_NAME.USER).find({
                $and: [
                    { username: option.sender },
                    { [`balance.${option.send_token}`]: { $gte: option.amount } }
                ]
            }).toArray()
            if (senderData.length === 0) return 400103
            const query: any = [
                {
                    updateOne: {
                        filter: { username: option.sender },
                        update: { $inc: { [`balance.${option.send_token}`]: -option.amount }, $set: { updated_at: new Date(Date.now()).toISOString() } }
                    }
                }
            ]
            if (option.send_token === option.to_token) {
                query.push({
                    updateOne: {
                        filter: { username: option.recipient },
                        update: { $inc: { [`balance.${option.to_token}`]: option.amount }, $set: { updated_at: new Date(Date.now()).toISOString() } }
                    }
                })
            } else {
                const getCurPrice = await selectDB.collection(COLLECTION_NAME.CURRENCY_PRICE).find({
                    cur_name: { $in: [option.send_token, option.to_token] }
                }).toArray()
                if (getCurPrice.length === 0) return 400104
                const prices: any = {};
                getCurPrice.forEach(({ cur_name, cur_price }) => {
                    prices[cur_name] = cur_price;
                });

                const exchangeRate = prices[option.send_token] * Number(option.amount)
                const totalAmount = exchangeRate / prices[option.to_token]

                query.push({
                    updateOne: {
                        filter: { username: option.recipient },
                        update: { $inc: { [`balance.${option.to_token}`]: totalAmount }, $set: { updated_at: new Date(Date.now()).toISOString() } }
                    }
                })
            }
            await selectDB.collection(collection).bulkWrite(query)
            const data = await selectDB.collection(COLLECTION_NAME.USER).find({ username: option.sender }).toArray()
            return data[0].balance
        } catch (err: any) {
            console.log(err);
            return null
        } finally {
            client.close()
        }
    }

    private mockWallet() {
        const char = '0123456789abcdef'
        let wallet = '0x'
        for (let i = 0; i < 42; i++) {
            const randomChar = Math.floor(Math.random() * char.length)
            wallet += char[randomChar]
        }
        return wallet
    }
}


export default UserDaos