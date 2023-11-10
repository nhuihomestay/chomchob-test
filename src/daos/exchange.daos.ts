import { MongoClient } from 'mongodb';
import { COLLECTION_NAME } from 'src/constant/db.constant';

class ExchangeDaos {
    public async queryCurrency(option: any): Promise<any> {
        const client = new MongoClient(process.env.DATABASE_ENV || '');
        try {
            await client.connect()
            const selectDB = client.db(process.env.DATABASE_NAME || '')
            const data = await selectDB.collection(COLLECTION_NAME.CURRENCY_PRICE).find(option).toArray()
            return data
        } catch (err: any) {
            console.log(err);
            return null
        } finally {
            client.close()
        }
    }

    public async updateCurrency(option: any): Promise<any> {
        const client = new MongoClient(process.env.DATABASE_ENV || '');
        try {
            await client.connect()
            const selectDB = client.db(process.env.DATABASE_NAME || '')
            const data = await selectDB.collection(COLLECTION_NAME.CURRENCY_PRICE).updateOne({ cur_name: option.cur_name }, {
                $set: {
                    cur_price: option.cur_price
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
}


export default ExchangeDaos