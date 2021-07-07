import axios from "axios";
import moment from "moment";

const BASIC_ATLAS_API_URL = 'https://atlasbus.by/api';

// animals: {available: false, description: ""}
// arrival: "2021-07-09T08:00:00"
// atlasMeta: {miles: {cash: 275, card: 0}}
// benefits: []
// bookFields: ["phone", "name", "surname"]

// bus: {
// branding: "no_branding"
// color: {code: "FF9966", name: "Оранжевый"}
// mark: "Mercedes-Benz"
// model: "Sprinter"
// reg: "АВ 1843-4"
// }

// carpoolMeta: {}
// carrier: "ООО \"Кронон Сервис\""
// carrierID: "108"
// carrier_phones: ["375295555587", "375445555587"]
// connector: "atlas"
// currency: "BYN"
// departure: "2021-07-09T06:00:00"

// dischargeStops: [{
// datetime: "2021-07-09T08:00:00Z"
// desc: "АС Дружная"
// dynamic: false
// id: "41552"
// important: false
// info: ""
// latitude: 53.88900851717116
// longitude: 27.545894193211637
// timezone: "Europe/Minsk"
// }]

// driver: {}
// dynamicConfig: {prepareTime: 0}
// dynamicMode: false
// fee: 0
// flightPopular: 0
// freeSeats: 5

// freighter: {
//address: ""
// authority: "Администрация Октябрьского района г. Гродно"
// id: 138
// inn: ""
// kpp: ""
// name: "ИП Калач В.Н."
// ogrn: ""
// regDate: "9 апреля 2019"
// unp: "591921221"
// workingTime: "8.00-17.00"
// }

// from: {id: "c624785", desc: "Новогрудок", timezone: "Europe/Minsk"}
// id: "atlas:2652837:624785:625144:5"

// legal: {
// address: "г. Гродно  ул. Напалеона Орды 14 кв 13"
// country: "by"
// name: "ИП Калач В.Н."
// phone: "375295555587"
// tin: "591921221"
// }

// luggage: {available: false, description: ""}
// name: "Новогрудок → Кореличи → Мир → Минск"
// onlinePrice: 55
// onlineRefund: true
// partner: "108"
// partnerName: "Atlas"
// paymentTypes: ["atlas_promocode", "miles", "cash"]

// pickupStops: [{
//datetime: "2021-07-09T05:49:00Z"
// desc: "Хлебзавод"
// dynamic: false
// id: "41548"
// important: false
// info: ""
// latitude: 53.59770345651211
// longitude: 25.80846270674301
// timezone: "Europe/Minsk"
// },
// {
// datetime: "2021-07-09T05:50:00Z"
// desc: "Баня"
// dynamic: false
// id: "41543"
// important: false
// info: ""
// latitude: 53.594492145073374
// longitude: 25.813212905362906
// timezone: "Europe/Minsk"
// },
// {
// datetime: "2021-07-09T05:55:00Z"
// desc: "ТЦ Пони"
// dynamic: false
// id: "41544"
// important: false
// info: ""
// latitude: 53.584838853860234
// longitude: 25.806720817691023
// timezone: "Europe/Minsk"
// },
// {
// datetime: "2021-07-09T06:00:00Z"
// desc: "Ресторан Валерия"
// dynamic: false
// id: "41546"
// important: false
// info: ""
// latitude: 53.590826518291
// longitude: 25.820452600738
// timezone: "Europe/Minsk"
// },
// {
// datetime: "2021-07-09T06:01:00Z"
// desc: "Ziko"
// dynamic: false
// id: "41547"
// important: false
// info: ""
// latitude: 53.599375290619214
// longitude: 25.82596430814358
// timezone: "Europe/Minsk"
// }]

// price: 55
// rideType: null
// routeName: "Новогрудок → Кореличи → Мир → Минск"
// saasId: null
// saleTypes: ["channel", "direct"]
// status: "sale"
// ticketLimit: 5
// to: {id: "c625144", desc: "Минск", timezone: "Europe/Minsk"}
// valid_before: 600

//Date format '%Y-%m-%d'
const formatDateForAtlas = (date: any) => {
    return `${date.split('-')[2]}-${date.split('-')[1]}-${date.split('-')[0]}`;
};

export const atlasBusTripsFetcher = (url: any, params: any): any => {
    return axios({
        method: 'get',
        url,
        responseType: 'json',
    }).then(response => {
        let rides = response && response.data && response.data.rides || {};
        let {from, to, operatorId, passengers} = params;

        if (rides.length === 0) {
            return atlasBusTripsFetcher(url, params);
        } else {
            return rides
                .map((trip: any) => {
                    let {departure, freeSeats, price, arrival} = trip;

                    return {
                        from,
                        to,
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
                .filter((trip: any) => passengers ? trip.freeSeats >= passengers : trip.freeSeats > 0);
        }
    })
        .catch(() => {
            return [];
        });
};

export const getAtlasBusTrips = (params: any) => {
    let {from, to, date, operatorId, passengers} = params;
    let {id: fromId, operatorKey: fromOperatorKey} = from;
    let {id: toId, operatorKey: toOperatorKey} = to;

    let formattedDate = formatDateForAtlas(date);

    let url = `${BASIC_ATLAS_API_URL}/search`
        + `?from_id=${fromOperatorKey}`
        + `&to_id=${toOperatorKey}`
        + `&calendar_width=30`
        + `&date=${formattedDate}`
        + `&passengers=1`;

    return atlasBusTripsFetcher(url, {from: fromId, to: toId, operatorId, passengers});
};