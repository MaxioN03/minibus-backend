import mongodb from 'mongodb';
let ObjectID = mongodb.ObjectID;

export const getCollection = (db: any) => {
  return db.db('minibus-app-backend').collection('operators');
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
    getCollection(db).findOne(details, (error: any, response: any) => {
          if (error) {
            reject(error);
          } else {
            resolve(response);
          }
        });
  });
};

export const create = (db: any, operator: any) => {

  return new Promise((resolve, reject) => {
    getCollection(db).insertOne(operator, (error: any, response: any) => {
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
    getCollection(db).remove(details, (error: any, response: any) => {
          if (error) {
            reject(error);
          } else {
            resolve(response);
          }
        });
  });
};

export const update = (db: any, id: string, operator: any) => {

  const details = {'_id': new ObjectID(id)};

  return new Promise((resolve, reject) => {
    getCollection(db).update(details, operator, (error: any, response: any) => {
          if (error) {
            reject(error);
          } else {
            resolve(response);
          }
        });
  });
};