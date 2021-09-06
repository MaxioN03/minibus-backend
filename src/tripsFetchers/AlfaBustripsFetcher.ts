import axios, {AxiosRequestConfig} from "axios";
import {URLSearchParams} from "url";
import {ITrip, ITripParams} from "../requests/tripsRequest";
import {asyncRetry} from "../utils";

const ALFA_BUS_ARROW_TRIP_SPLITTER = ' -> ';

interface IAlfaBusTrip {
    active: boolean,
    all_seats: number,
    currency: string,
    date: string, //"13-07-2021",
    datetime: string, //"2021-07-13T06:00:00",
    departure_time: string, //"06:00",
    id: string,
    price: string, //"11.00",
    route: string, //"Новогрудок -> Минск",
    route_id: number,
    seats: number,
    show_free_seats: boolean,
    transport: string,
    trip_key: number,
    weekday: number,
}

export const getAlfaBusTrips = async (params: ITripParams): Promise<ITrip[]> => {
    let {from, to, date, operatorId, passengers} = params;
    let {id: fromId, operatorKey: fromOperatorKey} = from;
    let {id: toId, operatorKey: toOperatorKey} = to;

    try {
        let alfaBusTrips = await makeAlfaBusRequest(params);

        return alfaBusTrips.filter((trip: IAlfaBusTrip) => {
            let {date: tripDate, route, seats, datetime} = trip;
            let tripStations = route.split(ALFA_BUS_ARROW_TRIP_SPLITTER);
            let [tripFrom, tripTo] = tripStations;

            return tripFrom === fromOperatorKey
                && tripTo === toOperatorKey
                && tripDate === date
                && +new Date(datetime) > +new Date()
                && seats > (passengers || 0);
        })
            .sort((trip1: IAlfaBusTrip, trip2: IAlfaBusTrip) => {
                let {datetime: datetime1} = trip1;
                let {datetime: datetime2} = trip2;

                return datetime1.localeCompare(datetime2);
            })
            .map((trip: IAlfaBusTrip) => {
                let {date: tripDate, seats, datetime, price} = trip;

                return {
                    from: fromId,
                    to: toId,
                    date: tripDate,
                    departure: datetime,
                    freeSeats: seats,
                    price: +price,
                    agent: operatorId,
                };
            });
    } catch (error) {
        throw error;
    }
};

const makeAlfaBusRequest = async (params: ITripParams): Promise<IAlfaBusTrip[]> => {
    let {date} = params;

    const URLParams = new URLSearchParams();
    URLParams.append('date', formatDateForAlfaBus(date));

    let axiosParams: AxiosRequestConfig = {
        method: 'post',
        url: 'https://alfa-bus.by/timetable/trips/',
        responseType: 'json',
        data: URLParams,
    };

    let response = await asyncRetry(axios.bind(null, axiosParams));
    let tripsObject = response && response.data && response.data.data &&
        response.data.data.trips || {};
    return Object.values(tripsObject);
};

//Date format '%YYYY-%mm-%dd'
const formatDateForAlfaBus = (date: any) => {
    return `${date.split('-')[2]}-${date.split('-')[1]}-${date.split('-')[0]}`;
};