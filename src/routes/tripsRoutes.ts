import {getTrips} from "../requests/tripsRequest";

const getTripParamsFromReq = (req: any) => {
  let params = req.body;
  let {from, to, date, passengers} = params;

  return {from, to, date, passengers: +passengers};
};

export default function(app: any, db: any) {
  app.post('/trips', (req: any, res: any) => {
    const tripParams = getTripParamsFromReq(req);

    getTrips(db, tripParams)
        .then((response: any) => {
          res.send(response);
        })
        .catch((error: any) => {
          res.status(500).send(`Error while getting trips:\n${error.stack}`);
        });
  });
};