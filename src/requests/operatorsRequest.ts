import {getAll, getOne, create, remove, update} from "../DAO/operatorsDAO";

export const getAllOperators = (db: any) => {
    return getAll(db);
};

export const getOperator = (db: any, id: string) => {
    return getOne(db, id);
};

export const createOperator = (db: any, operator: any) => {
    return create(db, operator);
};

export const removeOperator = (db: any, id: string) => {
    return remove(db, id);
};

export const updateOperator = (db: any, id: string, operator: any) => {
    return update(db, id, operator);
};