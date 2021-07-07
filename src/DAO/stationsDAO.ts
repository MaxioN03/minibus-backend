let ObjectID = require('mongodb').ObjectID;

const getCollection = (db: any) => {
  return db.db('minibus-app-backend').collection('stations');
};

export const getAll = (db: any) => {
  return getCollection(db).find({}).toArray()
      .then((response: any) => {
        return response;
      })
      .catch((error: any) => {
        return error;
      });
};

export const getOne = (db: any, id: string) => {
  const details = {'_id': new ObjectID(id)};

  return new Promise((resolve, reject) => {
    getCollection(db)
        .findOne(details, (error: any, response: any) => {
          if (error) {
            reject(error);
          } else {
            resolve(response);
          }
        });
  });
};

export const create = (db: any, station: any) => {

  return new Promise((resolve, reject) => {
    getCollection(db)
        .insertOne(station, (error: any, response: any) => {
          if (error) {
            reject(error);
          } else {
            resolve(response.ops[0]);
          }
        });
  });
};

export const remove = (db: any, id: string) => {
  const details = {'_id': new ObjectID(id)};

  return new Promise((resolve, reject) => {
    getCollection(db)
        .remove(details, (error: any, response: any) => {
          if (error) {
            reject(error);
          } else {
            resolve(response);
          }
        });
  });
};

export const update = (db: any, id: string, station: any) => {

  const details = {'_id': new ObjectID(id)};

  return new Promise((resolve, reject) => {
    getCollection(db)
        .update(details, station, (error: any, response: any) => {
          if (error) {
            reject(error);
          } else {
            resolve(response);
          }
        });
  });
};