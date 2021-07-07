import {create, getAll, getOne, remove, update} from "../DAO/stationsDAO";

export const getAllStations = (db: any) => {
    return getAll(db);
};

export const getStation = (db: any, id: string) => {
    return getOne(db, id);
};

export const createStation = (db: any, station: any) => {
    return create(db, station);
};

export const removeStation = (db: any, id: string) => {
    return remove(db, id);
};

export const updateStation = (db: any, id: string, station: any) => {
    return update(db, id, station);
};