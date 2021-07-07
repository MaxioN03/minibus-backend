import {
    createOperator,
    getAllOperators,
    getOperator,
    removeOperator,
    updateOperator
} from "../requests/operatorsRequest";

const getIdFromReq = (req: any) => {
  return req.params.id;
};

const getOperatorFromReq = (req: any) => {
  return {name: req.body.name};
};

export default function(app: any, db: any) {
  app.get('/operators', (req: any, res: any) => {
    getAllOperators(db)
        .then((response: any) => {
          res.send(response);
        })
        .catch((error: any) => {
          res.send(error);
        });
  });

  app.get('/operators/:id', (req: any, res: any) => {
    const id = getIdFromReq(req);

    getOperator(db, id)
        .then((response: any) => {
          res.send(response);
        })
        .catch((error: any) => {
          res.send(error);
        });
  });

  app.post('/operators', (req: any, res: any) => {
   const operator = getOperatorFromReq(req);

    createOperator(db, operator)
        .then((response: any) => {
          res.send(response);
        })
        .catch((error: any) => {
          res.send(error);
        });
  });

  app.delete('/operators/:id', (req: any, res: any) => {
    const id = getIdFromReq(req);

    removeOperator(db, id)
        .then((response: any) => {
          res.send(response);
        })
        .catch((error: any) => {
          res.send(error);
        });
  });

  app.put('/operators/:id', (req: any, res: any) => {
    const id = getIdFromReq(req);
   const operator = getOperatorFromReq(req);

    updateOperator(db, id, operator)
        .then((response: any) => {
          res.send(response);
        })
        .catch((error: any) => {
          res.send(error);
        });
  });
};