import {Express, Request, Response} from "express";
import {MongoClient} from "mongodb";
import {createStation, getAllStations, getStation, removeStation, updateStation} from "../requests/stationsRequest";
import {IStation} from "../DAO/stationsDAO";


const getIdFromReq = (req: Request) => {
    return req.params.id;
};

const getStationFromReq = (req: Request) => {
    return {name: req.body.name, operatorsKeys: req.body.operatorsKeys};
};

export default function (app: Express, db: MongoClient) {
    app.get('/stations', (req: Request, res: Response) => {
        getAllStations(db)
            .then((response: IStation[]) => {
                res.send(response);
            })
            .catch((error: any) => {
                res.status(error.code).send(error);
            });
    });

    app.get('/stations/:id', (req: Request, res: Response) => {
        const id = getIdFromReq(req);

        getStation(db, id)
            .then((response: IStation) => {
                res.send(response);
            })
            .catch((error: any) => {
                res.status(error.code).send(error);
            });
    });

    app.post('/stations', (req: Request, res: Response) => {
        const station = getStationFromReq(req);

        createStation(db, station)
            .then((response: string) => {
                res.send(response);
            })
            .catch((error: any) => {
                res.status(error.code).send(error);
            });
    });

    app.delete('/stations/:id', (req: Request, res: Response) => {
        const id = getIdFromReq(req);

        removeStation(db, id)
            .then(response => {
                res.send(response);
            })
            .catch((error: any) => {
                res.status(error.code).send(error);
            });
    });

    app.put('/stations/:id', (req: Request, res: Response) => {
        const id = getIdFromReq(req);
        const station = getStationFromReq(req);

        updateStation(db, id, station)
            .then(response => {
                res.send(response);
            })
            .catch((error: any) => {
                res.status(error.code).send(error);
            });
    });
};