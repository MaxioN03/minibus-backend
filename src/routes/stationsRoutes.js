const stationRequest = require('../requests/stationsRequest');

const getIdFromReq = (req) => {
  return req.params.id;
};

const getStationFromReq = (req) => {
  return {name: req.body.name, operatorsKeys: req.body.operatorsKeys};
};

module.exports = function(app, db) {
  app.get('/stations', (req, res) => {
    stationRequest.getAllStations(db)
        .then(response => {
          res.send(response);
        })
        .catch(error => {
          res.send(error);
        });
  });

  app.get('/stations/:id', (req, res) => {
    const id = getIdFromReq(req);

    stationRequest.getStation(db, id)
        .then(response => {
          res.send(response);
        })
        .catch(error => {
          res.send(error);
        });
  });

  app.post('/stations', (req, res) => {
    const station = getStationFromReq(req);

    stationRequest.createStation(db, station)
        .then(response => {
          res.send(response);
        })
        .catch(error => {
          res.send(error);
        });
  });

  app.delete('/stations/:id', (req, res) => {
    const id = getIdFromReq(req);

    stationRequest.removeStation(db, id)
        .then(response => {
          res.send(response);
        })
        .catch(error => {
          res.send(error);
        });
  });

  app.put('/stations/:id', (req, res) => {
    const id = getIdFromReq(req);
    const station = getStationFromReq(req);

    stationRequest.updateStation(db, id, station)
        .then(response => {
          res.send(response);
        })
        .catch(error => {
          res.send(error);
        });
  });
};