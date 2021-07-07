const tripsFetcher = require('../tripsFetchers/tripsFetcher');
const stationRequest = require('../DAO/stationsDAO');
const operatorsRequest = require('../DAO/operatorsDAO');
const {OPERATORS_NAMES} = require('../constants');
const cache = require('memory-cache');

const getTrips = (db, params) => {
  let {from, to, date, passengers} = params;

  let cacheKey = `${from}_${to}_${date}_${passengers || 0}`;

  if (cache.get(cacheKey) !== null) {
    return new Promise((resolve) => {
      resolve(cache.get(cacheKey));
    });
  } else {
    let fromStationRequest = stationRequest.getOne(db, from);
    let toStationRequest = stationRequest.getOne(db, to);

    return new Promise((resolve, reject) => {
      Promise.all([fromStationRequest, toStationRequest])
          .then(stations => {
            let [fromStation = {}, toStation = {}] = stations || [];
            let fromStationOperatorsKeys = fromStation.operatorsKeys || {};
            let toStationOperatorsKeys = toStation.operatorsKeys || {};

            operatorsRequest.getAll(db)
                .then(operators => {

                  let tripsFetchersArray = operators.filter(operator => {
                    let {_id = ''} = operator || {};
                    return _id in fromStationOperatorsKeys
                        && _id in toStationOperatorsKeys;
                  })
                      .map(operator => {

                        let {name = null} = operator;

                        switch (name) {
                          case OPERATORS_NAMES.atlas:
                            return tripsFetcher.getAtlasBusTrips({
                              from: {
                                id: from,
                                operatorKey: fromStationOperatorsKeys[operator._id],
                              },
                              to: {
                                id: to,
                                operatorKey: toStationOperatorsKeys[operator._id],
                              },
                              date,
                              passengers,
                              operatorId: operator._id,
                            });
                          case OPERATORS_NAMES.alfabus:
                            return tripsFetcher.getAlfaBusTrips({
                              from: {
                                id: from,
                                operatorKey: fromStationOperatorsKeys[operator._id],
                              },
                              to: {
                                id: to,
                                operatorKey: toStationOperatorsKeys[operator._id],
                              },
                              date,
                              passengers,
                              operatorId: operator._id,
                            });
                        }
                      });

                  return Promise.all(tripsFetchersArray)
                      .then(trips => {
                        let resultTrips = trips
                            .reduce((result, tripArray) => {
                              result.push(...tripArray);
                              return result;
                            }, [])
                            .sort((trip1, trip2) => {
                              let departureTime1 = +new Date(trip1.departure);
                              let departureTime2 = +new Date(trip2.departure);

                              return departureTime1 - departureTime2;
                            });

                        cache.put(cacheKey, resultTrips, 5000);
                        resolve(resultTrips);
                      })
                      .catch(tripsErrors => {
                        reject(tripsErrors);
                      });
                })
                .catch(operatorsErrors => {
                  reject(operatorsErrors);
                });

          }).catch(stationsErrors => {
        reject(stationsErrors);
      });
    });
  }
};

module.exports = {
  getTrips,
};