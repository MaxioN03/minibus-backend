const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8000;
const routes = require('./src/routes');

app.use(cors());

app.use(bodyParser.json());

MongoClient.connect(process.env.DATABASE_URI, (err, database) => {
  if (err) return console.log(err);

  routes(app, database);

  app.listen(port, () => {
    console.log('We are live on ' + port);
  });
});
