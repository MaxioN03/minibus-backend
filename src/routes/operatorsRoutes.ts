import {
    createOperator,
    getAllOperators,
    getOperator,
    removeOperator,
    updateOperator
} from "../requests/operatorsRequest";
import {Express, Request, Response} from "express";
import {MongoClient} from "mongodb";
import {IOperator} from "../DAO/operatorsDAO";

const getIdFromReq = (req: Request) => {
  return req.params.id;
};

const getOperatorFromReq = (req: Request) => {
  return {name: req.body.name};
};

export default function(app: Express, db: MongoClient) {
  app.get('/operators', (req: Request, res: Response) => {
    getAllOperators(db)
        .then((response: IOperator[]) => {
            res.send(response);
        })
        .catch((error: any) => {
            res.status(error.code).send(error);
        });
  });

  app.get('/operators/:id', (req: Request, res: Response) => {
    const id = getIdFromReq(req);

    getOperator(db, id)
        .then((response: IOperator) => {
            res.send(response);
        })
        .catch((error: any) => {
            res.status(error.code).send(error);
        });
  });

  app.post('/operators', (req: Request, res: Response) => {
   const operator = getOperatorFromReq(req);

    createOperator(db, operator)
        .then((response: string) => {
            res.send(response);
        })
        .catch((error: any) => {
            res.status(error.code).send(error);
        });
  });

  app.delete('/operators/:id', (req: Request, res: Response) => {
    const id = getIdFromReq(req);

    removeOperator(db, id)
        .then(response => {
            res.send(response);
        })
        .catch((error: any) => {
            res.status(error.code).send(error);
        });
  });

  app.put('/operators/:id', (req: Request, res: Response) => {
    const id = getIdFromReq(req);
   const operator = getOperatorFromReq(req);

    updateOperator(db, id, operator)
        .then(response => {
            res.send(response);
        })
        .catch((error: any) => {
            res.status(error.code).send(error);
        });
  });
};