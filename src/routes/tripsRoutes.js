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

          console.log('response', response);

          res.send(response);
        })
        .catch(error => {
          res.send(error);
        });
  });
};