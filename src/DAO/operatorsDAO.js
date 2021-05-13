let ObjectID = require('mongodb').ObjectID;

const getCollection = (db) => {
  return db.db('minibus').collection('operators');
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
    getCollection(db).findOne(details, (error, response) => {
          if (error) {
            reject(error);
          } else {
            resolve(response);
          }
        });
  });
};

const create = (db, operator) => {

  return new Promise((resolve, reject) => {
    getCollection(db).insertOne(operator, (error, response) => {
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
    getCollection(db).remove(details, (error, response) => {
          if (error) {
            reject(error);
          } else {
            resolve(response);
          }
        });
  });
};

const update = (db, id, operator) => {

  const details = {'_id': new ObjectID(id)};

  return new Promise((resolve, reject) => {
    getCollection(db).update(details, operator, (error, response) => {
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