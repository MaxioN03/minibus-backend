import {create, getAll, getOne, IStation, remove, update} from "../DAO/stationsDAO";
import {MongoClient} from "mongodb";

export const getAllStations = (db: MongoClient) => {
    return getAll(db);
};

export const getStation = (db: MongoClient, id: string) => {
    return getOne(db, id);
};

export const createStation = (db: MongoClient, station: IStation) => {
    return create(db, station);
};

export const removeStation = (db: MongoClient, id: string) => {
    return remove(db, id);
};

export const updateStation = (db: MongoClient, id: string, station: IStation) => {
    return update(db, id, station);
};