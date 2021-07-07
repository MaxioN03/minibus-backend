import {OPERATORS_NAMES}from '../constants'
import cache from 'memory-cache';
import {getOne} from "../DAO/stationsDAO";
import {getAll} from "../DAO/operatorsDAO";
import {getAtlasBusTrips} from "../tripsFetchers/AtlasTripsFetcher";
import {getAlfaBusTrips} from "../tripsFetchers/AlfaBustripsFetcher";

export const getTrips = (db: any, params: any) => {
    let {from, to, date, passengers} = params;

    let cacheKey = `${from}_${to}_${date}_${passengers || 0}`;

    if (cache.get(cacheKey) !== null) {
        return new Promise((resolve) => {
            resolve(cache.get(cacheKey));
        });
    } else {
        let fromStationRequest = getOne(db, from);
        let toStationRequest = getOne(db, to);

        return new Promise((resolve, reject) => {
            Promise.all([fromStationRequest, toStationRequest])
                .then((stations: any[]) => {
                    let [fromStation = {}, toStation = {}] = stations || [];
                    let fromStationOperatorsKeys = fromStation.operatorsKeys || {};
                    let toStationOperatorsKeys = toStation.operatorsKeys || {};

                    getAll(db)
                        .then((operators: any[]) => {

                            let tripsFetchersArray = operators.filter(operator => {
                                let {_id = ''} = operator || {};
                                return _id in fromStationOperatorsKeys
                                    && _id in toStationOperatorsKeys;
                            })
                                .map(operator => {

                                    let {name = null} = operator;

                                    switch (name) {
                                        case OPERATORS_NAMES.atlas:
                                            return getAtlasBusTrips({
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
                                            return getAlfaBusTrips({
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
                                        .sort((trip1: any, trip2: any) => {
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
                        .catch((operatorsErrors: Error) => {
                            reject(operatorsErrors);
                        });

                }).catch(stationsErrors => {
                reject(stationsErrors);
            });
        });
    }
};