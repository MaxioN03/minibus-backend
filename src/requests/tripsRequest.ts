import {MAX_VISIBILITY_DAYS, OPERATORS_NAMES} from '../constants';
import cache from 'memory-cache';
import {IStation} from "../DAO/stationsDAO";
import {getAtlasBusTrips} from "../tripsFetchers/AtlasTripsFetcher";
import {getAlfaBusTrips} from "../tripsFetchers/AlfaBustripsFetcher";
import {MongoClient, ObjectId} from "mongodb";
import {ITripsParams} from "../routes/tripsRoutes";
import {getAllOperators} from "./operatorsRequest";
import {getStation} from "./stationsRequest";
import {getDateFromRu} from "../utils";

export interface ITripParams {
    from: {
        id: string,
        operatorKey: string,
    },
    to: {
        id: string,
        operatorKey: string,
    },
    date: string,
    passengers: number,
    operatorId: string,
}

export interface ITrip {
    from: string,
    to: string,
    date: string, //'DD-MM-YYYY',
    departure: string,
    freeSeats: number,
    price: number | null,
    agent: string,
    arrival?: string
}

const isDateGood = (date: string) => {
    let dateObject = getDateFromRu(date);
    if (dateObject === null) {
        return false;
    }

    let todayTimestamp = new Date().setHours(0, 0, 0, 0);

    let tmpDateForMaxDate = new Date(todayTimestamp);
    let maxDate = tmpDateForMaxDate.setDate(tmpDateForMaxDate.getDate() + MAX_VISIBILITY_DAYS);

    return +dateObject >= +todayTimestamp && +dateObject < +maxDate;
};

export const getTrips = (db: MongoClient, params: ITripsParams): Promise<ITrip[]> => {
    let {from, to, date, passengers} = params;

    //Check params for errors
    if (!isDateGood(date)) {
        return Promise.reject({
            code: 400,
            message: 'invalid date in parameters',
            display: 'Неподходящая дата поездки'
        });
    }
    if (!passengers || passengers < 1) {
        return Promise.reject({
            code: 400,
            message: 'invalid passengers number in parameters',
            display: 'Неверное число пассажиров'
        });
    }
    if (!ObjectId.isValid(from) || !ObjectId.isValid(to)) {
        return Promise.reject({
            code: 400,
            message: 'invalid from or to id in parameters',
            display: 'Не получилось найти город'
        });
    }

    let cacheKey = `${from}_${to}_${date}_${passengers || 0}`;
    if (cache.get(cacheKey) !== null) {
        return Promise.resolve(cache.get(cacheKey));
    }

    let fromStationRequest = getStation(db, from);
    let toStationRequest = getStation(db, to);

    return Promise.all([fromStationRequest, toStationRequest])
        .then((stations: [IStation, IStation]) => {
            let [fromStation, toStation] = stations || [];
            let fromStationOperatorsKeys = fromStation?.operatorsKeys || {};
            let toStationOperatorsKeys = toStation?.operatorsKeys || {};

            return Promise.all([getAllOperators(db), fromStationOperatorsKeys, toStationOperatorsKeys]);
        })
        .then(response => {
            let [operators, fromStationOperatorsKeys, toStationOperatorsKeys] = response;

            let tripsFetchersArray: Promise<any>[] = operators
                .filter(operator => {
                    let {_id = ''} = operator || {};
                    return _id in fromStationOperatorsKeys
                        && _id in toStationOperatorsKeys;
                })
                .map(operator => {

                    let {name = null} = operator;
                    const tripParams: ITripParams = {
                        from: {
                            id: from,
                            operatorKey: fromStationOperatorsKeys[operator._id || ''],
                        },
                        to: {
                            id: to,
                            operatorKey: toStationOperatorsKeys[operator._id || ''],
                        },
                        date,
                        passengers: passengers || 1,
                        operatorId: operator?._id || '',
                    };

                    switch (name) {
                        case OPERATORS_NAMES.atlas:
                            return getAtlasBusTrips(tripParams);
                        case OPERATORS_NAMES.alfabus:
                            return getAlfaBusTrips(tripParams);
                        default:
                            return Promise.resolve([]);
                    }
                });

            return Promise.all(tripsFetchersArray);
        })
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

            return resultTrips;
        })
        .catch(error => {
            throw {
                code: 500,
                message: error.message,
                display: 'Не вышло получить поездки'
            }
        });
};