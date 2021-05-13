const operatorsRequest = require('../requests/operatorsRequest');

const getIdFromReq = (req) => {
  return req.params.id;
};

const getOperatorFromReq = (req) => {
  return {name: req.body.name};
};

module.exports = function(app, db) {
  app.get('/operators', (req, res) => {
    operatorsRequest.getAllOperators(db)
        .then(response => {
          res.send(response);
        })
        .catch(error => {
          res.send(error);
        });
  });

  app.get('/operators/:id', (req, res) => {
    const id = getIdFromReq(req);

    operatorsRequest.getOperator(db, id)
        .then(response => {
          res.send(response);
        })
        .catch(error => {
          res.send(error);
        });
  });

  app.post('/operators', (req, res) => {
   const operator = getOperatorFromReq(req);

    operatorsRequest.createOperator(db, operator)
        .then(response => {
          res.send(response);
        })
        .catch(error => {
          res.send(error);
        });
  });

  app.delete('/operators/:id', (req, res) => {
    const id = getIdFromReq(req);

    operatorsRequest.removeOperator(db, id)
        .then(response => {
          res.send(response);
        })
        .catch(error => {
          res.send(error);
        });
  });

  app.put('/operators/:id', (req, res) => {
    const id = getIdFromReq(req);
   const operator = getOperatorFromReq(req);

    operatorsRequest.updateOperator(db, id, operator)
        .then(response => {
          res.send(response);
        })
        .catch(error => {
          res.send(error);
        });
  });
};