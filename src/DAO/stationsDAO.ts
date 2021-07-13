import mongodb, {MongoClient, ObjectID as ObjectIDType} from 'mongodb';

let ObjectID = mongodb.ObjectID;

export interface IStation {
    _id?: ObjectIDType,
    name: string,
    operatorsKeys?: {
        [key: string]: string
    }
}

const getCollection = (db: MongoClient) => {
    return db.db('minibus-app-backend').collection('stations');
};

export const getAll = (db: MongoClient): Promise<IStation[]> => {
    return getCollection(db).find({}).toArray()
        .then(response => response)
        .catch(error => {
            throw {
                code: 500,
                message: error.message,
                display: 'Не удалось получить станции'
            };
        });

};

export const getOne = (db: MongoClient, id: string): Promise<IStation> => {
    const details = {'_id': new ObjectID(id)};

    return getCollection(db).findOne(details)
        .then((response: IStation) => response)
        .catch(error => {
            throw {
                code: 500,
                message: error.message,
                display: 'Не удалось получить станцию'
            };
        });
};

//returns _id
export const create = (db: MongoClient, station: IStation): Promise<string> => {
    return getCollection(db).insertOne(station)
        .then(response => response?.ops?.[0])
        .catch(error => {
            throw {
                code: 500,
                message: error.message,
                display: 'Не удалось создать станцию'
            };
        });
};

export const remove = (db: MongoClient, id: string) => {
    const details = {'_id': new ObjectID(id)};

    return getCollection(db).deleteOne(details)
        .then(response => response)
        .catch(error => {
            throw {
                code: 500,
                message: error.message,
                display: 'Не удалось удалить станцию'
            };
        });
};

export const update = (db: MongoClient, id: string, station: IStation) => {

    const details = {'_id': new ObjectID(id)};

    return getCollection(db).updateOne(details, station)
        .then(response => response)
        .catch(error => {
            throw {
                code: 500,
                message: error.message,
                display: 'Не удалось обновить станцию'
            };
        });
};