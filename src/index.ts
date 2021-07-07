import express, { Express } from 'express';
import mongodb from 'mongodb';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './routes';

const MongoClient = mongodb.MongoClient;
dotenv.config();

const PORT = process.env.PORT || 8000;
const DATABASE_URI = process.env.DATABASE_URI || '';
const app: Express = express();

app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

MongoClient.connect(DATABASE_URI, (err, database) => {
    if (err) return console.log(err);

    routes(app, database);

    app.listen(PORT, () => {
        console.log('We are live on ' + PORT);
    });
});