import Bot from './Bot';
import mongoose from 'mongoose';

mongoose
    .connect(process.env.MONGO_DB_CONNECTION, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
    .then(() => {
        console.info('Connected to MongoDB Database');
        console.info('Starting Bot');
        Bot.startUp();
    })
    .catch((error) => {
        console.error('Error while connecting to DB: ' + error);
    });
