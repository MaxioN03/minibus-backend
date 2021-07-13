import {getAll, getOne, create, remove, update, IOperator} from "../DAO/operatorsDAO";
import {MongoClient} from "mongodb";

export const getAllOperators = (db: MongoClient) => {
    return getAll(db);
};

export const getOperator = (db: MongoClient, id: string) => {
    return getOne(db, id);
};

export const createOperator = (db: MongoClient, operator: IOperator) => {
    return create(db, operator);
};

export const removeOperator = (db: MongoClient, id: string) => {
    return remove(db, id);
};

export const updateOperator = (db: MongoClient, id: string, operator: IOperator) => {
    return update(db, id, operator);
};