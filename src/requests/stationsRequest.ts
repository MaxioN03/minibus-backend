import {create, getAll, getOne, remove, update} from "../DAO/stationsDAO";

const getAllStations = (db: any) => {
    return getAll(db);
};

const getStation = (db: any, id: string) => {
    return getOne(db, id);
};

const createStation = (db: any, station: any) => {
    return create(db, station);
};

const removeStation = (db: any, id: string) => {
    return remove(db, id);
};

const updateStation = (db: any, id: string, station: any) => {
    return update(db, id, station);
};


module.exports = {
    getAllStations,
    getStation,
    createStation,
    removeStation,
    updateStation
};