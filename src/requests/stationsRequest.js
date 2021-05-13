const stationRequest = require('../DAO/stationsDAO');

const getAllStations = (db) => {
  return stationRequest.getAll(db);
};

const getStation = (db, id) => {
  return stationRequest.getOne(db, id);
};

const createStation = (db, station) => {
  return stationRequest.create(db, station);
};

const removeStation = (db, id) => {
  return stationRequest.remove(db, id);
};

const updateStation = (db, id, station) => {
  return stationRequest.update(db, id, station);
};


module.exports = {
  getAllStations,
  getStation,
  createStation,
  removeStation,
  updateStation
};