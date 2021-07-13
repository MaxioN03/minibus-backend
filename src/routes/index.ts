import {MongoClient} from "mongodb";
import {Express} from "express";
import stationsRoutes from './stationsRoutes';
import operatorsRoutes from './operatorsRoutes';
import tripsRoutes from './tripsRoutes';

const routes = (app: Express, db: MongoClient) => {
    stationsRoutes(app, db);
    operatorsRoutes(app, db);
    tripsRoutes(app, db);
};

export default routes;