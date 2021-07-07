import {Request, Response} from "express";

const stationRequest = require('../requests/stationsRequest');

const getIdFromReq = (req: Request) => {
    return req.params.id;
};

const getStationFromReq = (req: Request) => {
    return {name: req.body.name, operatorsKeys: req.body.operatorsKeys};
};

export default function (app: any, db: any) {
    app.get('/stations', (req: Request, res: Response) => {
        stationRequest.getAllStations(db)
            .then((response: any) => {
                res.send(response);
            })
            .catch((error: any) => {
                res.send(error);
            });
    });

    app.get('/stations/:id', (req: Request, res: Response) => {
        const id = getIdFromReq(req);

        stationRequest.getStation(db, id)
            .then((response: any) => {
                res.send(response);
            })
            .catch((error: any) => {
                res.send(error);
            });
    });

    app.post('/stations', (req: Request, res: Response) => {
        const station = getStationFromReq(req);

        stationRequest.createStation(db, station)
            .then((response: any) => {
                res.send(response);
            })
            .catch((error: any) => {
                res.send(error);
            });
    });

    app.delete('/stations/:id', (req: Request, res: Response) => {
        const id = getIdFromReq(req);

        stationRequest.removeStation(db, id)
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

        stationRequest.updateStation(db, id, station)
            .then((response: any) => {
                res.send(response);
            })
            .catch((error: any) => {
                res.send(error);
            });
    });
};