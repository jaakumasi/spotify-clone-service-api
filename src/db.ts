import * as mongoose from 'mongoose';

export default async () => {
    mongoose.connect(process.env.MONGO_URL, () => console.log('connected to mongodb'));
}