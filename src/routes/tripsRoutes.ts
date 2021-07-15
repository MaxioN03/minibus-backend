import {getTrips} from "../requests/tripsRequest";
import {Express, Request, Response} from "express";
import {MongoClient} from "mongodb";

export interface ITripsParams {
    from: string,
    to: string,
    date: string,
    passengers: number
}

const getTripParamsFromReq = (req: Request): ITripsParams => {
    let params = req.query;
    let {from = '', to = '', date = '', passengers = 1} = params;

    return {
        from: from.toString(),
        to: to.toString(),
        date: date.toString(),
        passengers: +passengers
    };
};

export default function (app: Express, db: MongoClient) {
    app.get('/trips', (req: Request, res: Response) => {

        getTrips(db, getTripParamsFromReq(req))
            .then(response => {
                res.send(response);
            })
            .catch(error => {
                res.status(error.code || 500).send({error});
            });
    });
};