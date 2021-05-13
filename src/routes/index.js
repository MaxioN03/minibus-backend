const stationsRoutes = require('./stationsRoutes');
const tripsRoutes = require('./tripsRoutes');
const operatorsRoutes = require('./operatorsRoutes');

module.exports = function(app, db) {
  stationsRoutes(app, db);
  tripsRoutes(app, db);
  operatorsRoutes(app, db);
};