const axios = require('axios');
const moment = require('moment');

const BASIC_ATLAS_API_URL = 'https://atlasbus.by/api';

const formatDateForAtlas = (date) => {
  return `${date.split('-')[2]}-${date.split('-')[1]}-${date.split('-')[0]}`;
};

const atlasBusTripsFetcher = (url, params) => {
  return axios({
    method: 'get',
    url,
    responseType: 'json',
  })
      .then(response => {
        let rides = response && response.data && response.data.rides || {};

        if (rides.length === 0) {
          return atlasBusTripsFetcher(url, params);
        } else {
          return rides
              .map(trip => {
                let {departure, freeSeats, price} = trip;
                let {from, to, operatorId} = params;

                return {
                  from,
                  to,
                  date: moment(departure).format('DD-MM-YYYY'),
                  departureTime: moment(departure)
                      .format('HH:mm'),
                  freeSeats: freeSeats,
                  price: price !== undefined && price !== null
                      ? +price.toFixed(2)
                      : null,
                  agent: operatorId,
                };
              })
              .filter(trip => trip.freeSeats > 0);
        }
      });
};

const getAtlasBusTrips = (params) => {
  let {from, to, date, operatorId} = params;
  let {id: fromId, operatorKey: fromOperatorKey} = from;
  let {id: toId, operatorKey: toOperatorKey} = to;

  let formattedDate = formatDateForAtlas(date);

  let url = `${BASIC_ATLAS_API_URL}/search`
      + `?from_id=${fromOperatorKey}`
      + `&to_id=${toOperatorKey}`
      + `&calendar_width=30`
      + `&date=${formattedDate}`
      + `&passengers=1`;

  return atlasBusTripsFetcher(url, {from: fromId, to: toId, operatorId});
};

module.exports = {
  getAtlasBusTrips,
};