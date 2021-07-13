import axios, {AxiosRequestConfig} from "axios";
import moment from "moment";
import {ITrip, ITripParams} from "../requests/tripsRequest";
import {asyncRetry} from "../utils";
import {URL} from "url";

const BASIC_ATLAS_URL = 'https://atlasbus.by/';

interface IAtlasTrip {
    animals: { available: boolean, description: string },
    arrival: string, //2021-07-09T08:00:00
    atlasMeta: { miles: { cash: number, card: number } },
    benefits: any[],
    bookFields: 'phone' | 'name' | 'surname',
    bus: {
        branding: string
        color: {
            code: string, //"FF9966",
            name: string
        }
        mark: string
        model: string
        reg: string
    }
    carpoolMeta: {}
    carrier: string
    carrierID: string
    carrier_phones: string[], //"375295555587"
    connector: string,
    currency: string,
    departure: string, //"2021-07-09T06:00:00"
    dischargeStops: [{
        datetime: string,//"2021-07-09T08:00:00Z"
        desc: string,
        dynamic: boolean,
        id: string,
        important: boolean,
        info: string,
        latitude: number, //53.88900851717116
        longitude: number, //27.545894193211637,
        timezone: string,
    }]
    driver: {},
    dynamicConfig: { prepareTime: number },
    dynamicMode: boolean,
    fee: number,
    flightPopular: number,
    freeSeats: number,
    freighter: {
        address: string,
        authority: string,
        id: number,
        inn: string,
        kpp: string,
        name: string,
        ogrn: string,
        regDate: string,
        unp: string,
        workingTime: string,
    },
    from: {
        id: string,
        desc: string,
        timezone: string
    },
    id: string,
    legal: {
        address: string,
        country: string,
        name: string,
        phone: string,
        tin: string
    },
    luggage: {
        available: boolean,
        description: string
    },
    name: string,
    onlinePrice: number,
    onlineRefund: boolean,
    partner: string,
    partnerName: string,
    paymentTypes: string[]

    pickupStops: {
        datetime: string, //"2021-07-09T05:49:00Z"
        desc: string
        dynamic: boolean
        id: string
        important: boolean
        info: string
        latitude: string, //53.59770345651211
        longitude: string, //25.80846270674301
        timezone: string
    }[]
    price: number,
    rideType: any,
    routeName: string
    saasId: string,
    saleTypes: string[],
    status: string,
    ticketLimit: number,
    to: {
        id: string,
        desc: string,
        timezone: string
    }
    valid_before: number
}

export const getAtlasBusTrips = async (params: ITripParams) => {
    let {from, to, operatorId, passengers} = params;
    let {id: fromId} = from;
    let {id: toId} = to;

    try {
        let atlasTrips: IAtlasTrip[] = await makeAtlasRequest(params);
        return atlasTrips
            .map((trip: IAtlasTrip) => {
                let {departure, freeSeats, price, arrival} = trip;

                return {
                    from: fromId,
                    to: toId,
                    date: moment(departure).format('DD-MM-YYYY'),
                    departure,
                    freeSeats,
                    price: price !== undefined && price !== null
                        ? +price.toFixed(2)
                        : null,
                    agent: operatorId,
                    arrival
                };
            })
            .filter((trip: ITrip) => trip.freeSeats >= Math.max(1, passengers));
    } catch (error) {
        throw error;
    }
};

const makeAtlasRequest = async (params: ITripParams) => {
    let {from, to, date, passengers} = params;
    let {operatorKey: fromOperatorKey} = from;
    let {operatorKey: toOperatorKey} = to;

    let formattedDate = formatDateForAtlas(date);

    let url = new URL('/api/search', BASIC_ATLAS_URL);
    let searchParams = url.searchParams;
    searchParams.set('from_id', fromOperatorKey);
    searchParams.set('to_id', toOperatorKey);
    searchParams.set('calendar_width', '30');
    searchParams.set('date', formattedDate);
    searchParams.set('passengers', passengers.toString());

    let axiosParams: AxiosRequestConfig = {
        responseType: 'json',
    };

    let response = await asyncRetry(axios.get.bind(null, url.toString(), axiosParams));
    return response?.data?.rides;
};

//Date format '%Y-%m-%d'
const formatDateForAtlas = (date: any) => {
    return `${date.split('-')[2]}-${date.split('-')[1]}-${date.split('-')[0]}`;
};