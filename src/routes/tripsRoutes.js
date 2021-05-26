const tripRequest = require('../requests/tripsRequest');

const getTripParamsFromReq = (req) => {
  let params = req.body;
  let {from, to, date} = params;

  return {from, to, date};
};

module.exports = function(app, db) {
  app.post('/trips', (req, res) => {
    const tripParams = getTripParamsFromReq(req);

    tripRequest.getTrips(db, tripParams)
        .then(response => {
          res.send(response);
        })
        .catch(error => {
          res.status(500).send(`Error while getting trips:\n${error.stack}`);
        });
  });
};