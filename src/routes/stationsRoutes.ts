import {Request, Response} from "express";
import {createStation, getAllStations, getStation, removeStation, updateStation} from "../requests/stationsRequest";

const getIdFromReq = (req: Request) => {
    return req.params.id;
};

const getStationFromReq = (req: Request) => {
    return {name: req.body.name, operatorsKeys: req.body.operatorsKeys};
};

export default function (app: any, db: any) {
    app.get('/stations', (req: Request, res: Response) => {
        getAllStations(db)
            .then((response: any) => {
                res.send(response);
            })
            .catch((error: any) => {
                res.send(error);
            });
    });

    app.get('/stations/:id', (req: Request, res: Response) => {
        const id = getIdFromReq(req);

        getStation(db, id)
            .then((response: any) => {
                res.send(response);
            })
            .catch((error: any) => {
                res.send(error);
            });
    });

    app.post('/stations', (req: Request, res: Response) => {
        const station = getStationFromReq(req);

        createStation(db, station)
            .then((response: any) => {
                res.send(response);
            })
            .catch((error: any) => {
                res.send(error);
            });
    });

    app.delete('/stations/:id', (req: Request, res: Response) => {
        const id = getIdFromReq(req);

        removeStation(db, id)
            .then((response: any) => {
                res.send(response);
            })
            .catch((error: any) => {
                res.send(error);
            });
    });

    app.put('/stations/:id', (req: Request, res: Response) => {
        const id = getIdFromReq(req);
        const station = getStationFromReq(req);

        updateStation(db, id, station)
            .then((response: any) => {
                res.send(response);
            })
            .catch((error: any) => {
                res.send(error);
            });
    });
};