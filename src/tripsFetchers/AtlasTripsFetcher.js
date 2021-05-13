const axios = require('axios');
const moment = require('moment');

const getAtlasBusTrips = (params) => {
  let {from, to, date} = params;

  date = `${date.split('-')[2]}-${date.split('-')[1]}-${date.split('-')[0]}`;

  let url = `https://atlasbus.by/api/search?from_id=${from}&to_id=${to}&calendar_width=30&date=${date}&passengers=1`;

  return axios({
    method: 'get',
    url,
    responseType: 'json',
  })
      .then(response => {
        let rides = response.data.rides;

        if (rides.length === 0) {
          return axios({
            method: 'get',
            url,
            responseType: 'json',
          })
              .then(response => {
                let rides = response.data.rides;

                if (rides.length === 0) {
                  return axios({
                    method: 'get',
                    url,
                    responseType: 'json',
                  })
                      .then(response => {
                        let rides = response.data.rides;

                        return rides
                            .map(trip => {
                              let {from, to, departure, freeSeats, price} = trip;

                              return {
                                from,
                                to,
                                date: moment(departure).format('DD-MM-YYYY'),
                                departureTime: moment(departure)
                                    .format('HH:mm'),
                                freeSeats: freeSeats,
                                price: price,
                                agent: 'Atlas',
                              };
                            })
                            .filter(trip => trip.freeSeats > 0);
                      });
                }
                else {
                  return rides
                      .map(trip => {
                        let {from, to, departure, freeSeats, price} = trip;

                        return {
                          from,
                          to,
                          date: moment(departure).format('DD-MM-YYYY'),
                          departureTime: moment(departure)
                              .format('HH:mm'),
                          freeSeats: freeSeats,
                          price: price,
                          agent: 'Atlas',
                        };
                      })
                      .filter(trip => trip.freeSeats > 0);
                }
              });
        }
        else {
          return rides
              .map(trip => {
                let {from, to, departure, freeSeats, price} = trip;

                return {
                  from,
                  to,
                  date: moment(departure).format('DD-MM-YYYY'),
                  departureTime: moment(departure)
                      .format('HH:mm'),
                  freeSeats: freeSeats,
                  price: price,
                  agent: 'Atlas',
                };
              })
              .filter(trip => trip.freeSeats > 0);
        }
      });
};

module.exports = {
  getAtlasBusTrips,
};