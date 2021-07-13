import mongodb, {MongoClient} from 'mongodb';

let ObjectID = mongodb.ObjectID;

export interface IOperator {
    _id?: string,
    name: string,
}

export const getCollection = (db: MongoClient) => {
    return db.db('minibus-app-backend').collection('operators');
};

export const getAll = (db: MongoClient): Promise<IOperator[]> => {
    return getCollection(db).find({}).toArray()
        .then(response => response)
        .catch(error => {
            throw {
                code: 500,
                message: error.message,
                display: 'Не удалось получить операторов'
            };
        });

};

export const getOne = (db: MongoClient, id: string): Promise<IOperator> => {
    const details = {'_id': new ObjectID(id)};

    return getCollection(db).findOne(details)
        .then((response: IOperator) => response)
        .catch(error => {
            throw {
                code: 500,
                message: error.message,
                display: 'Не удалось получить оператора'
            };
        });
};

//returns _id
export const create = (db: MongoClient, operator: IOperator): Promise<string> => {
    return getCollection(db).insertOne(operator)
        .then(response => response?.ops?.[0])
        .catch(error => {
            throw {
                code: 500,
                message: error.message,
                display: 'Не удалось создать оператора'
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
                display: 'Не удалось удалить оператора'
            };
        });
};

export const update = (db: MongoClient, id: string, operator: IOperator) => {

    const details = {'_id': new ObjectID(id)};

    return getCollection(db).updateOne(details, operator)
        .then(response => response)
        .catch(error => {
            throw {
                code: 500,
                message: error.message,
                display: 'Не удалось обновить оператора'
            };
        });
};