let ObjectID = require('mongodb').ObjectID;

const getCollection = (db) => {
  return db.db('minibus-app-backend').collection('stations');
};

const getAll = (db) => {
  return getCollection(db).find({}).toArray()
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
};

const getOne = (db, id) => {
  const details = {'_id': new ObjectID(id)};

  return new Promise((resolve, reject) => {
    getCollection(db)
        .findOne(details, (error, response) => {
          if (error) {
            reject(error);
          } else {
            resolve(response);
          }
        });
  });
};

const create = (db, station) => {

  return new Promise((resolve, reject) => {
    getCollection(db)
        .insertOne(station, (error, response) => {
          if (error) {
            reject(error);
          } else {
            resolve(response.ops[0]);
          }
        });
  });
};

const remove = (db, id) => {
  const details = {'_id': new ObjectID(id)};

  return new Promise((resolve, reject) => {
    getCollection(db)
        .remove(details, (error, response) => {
          if (error) {
            reject(error);
          } else {
            resolve(response);
          }
        });
  });
};

const update = (db, id, station) => {

  const details = {'_id': new ObjectID(id)};

  return new Promise((resolve, reject) => {
    getCollection(db)
        .update(details, station, (error, response) => {
          if (error) {
            reject(error);
          } else {
            resolve(response);
          }
        });
  });
};

module.exports = {
  getAll,
  getOne,
  create,
  remove,
  update,
};