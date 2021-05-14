const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 8000;
const routes = require('./src/routes');
const stationRequest = require('./src/requests/stationsRequest');

app.use(bodyParser.json());

MongoClient.connect(process.env.DATABASE_URL, (err, database) => {
  if (err) return console.log(err);

  routes(app, database);

  app.listen(port, () => {

    stationRequest.createStation(database, {name: 'SOME TEST'});

    console.log('We are live on ' + port);
  });
});