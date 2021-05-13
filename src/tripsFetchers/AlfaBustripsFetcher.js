const axios = require('axios');

const ALFA_BUS_ARROW_TRIP_SPLITTER = ' -> ';

const getAlfaBusTrips = (params) => {

  let {from, to, date} = params;
  const URLParams = new URLSearchParams();
  URLParams.append('date',
      `${date.split('-')[2]}-${date.split('-')[1]}-${date.split('-')[0]}`);

  return axios({
    method: 'post',
    url: 'https://alfa-bus.by/timetable/trips/',
    responseType: 'json',
    data: URLParams,
  })
      .then(response => {
        let tripsObject = response && response.data && response.data.data &&
            response.data.data.trips || {};
        let trips = Object.values(tripsObject);

        return trips.filter(trip => {
          let {date: tripDate, route, seats, datetime} = trip;
          let tripStations = route.split(ALFA_BUS_ARROW_TRIP_SPLITTER);
          let [tripFrom, tripTo] = tripStations;

          return tripFrom === from
              && tripTo === to
              && tripDate === date
              && +(new Date(datetime)) > +(new Date())
              && seats > 0;
        })
            .sort((trip1, trip2) => {
              let {datetime: datetime1} = trip1;
              let {datetime: datetime2} = trip2;

              return datetime1.localeCompare(datetime2);
            })
            .map(trip => {
              let {date: tripDate, route, seats, departure_time, price} = trip;
              let tripStations = route.split(ALFA_BUS_ARROW_TRIP_SPLITTER);

              return {
                from: tripStations[0],
                to: tripStations[1],
                date: tripDate,
                departureTime: departure_time,
                freeSeats: seats,
                price,
                agent: 'alfabus',
              };
            });
      });
};

module.exports = {
  getAlfaBusTrips,
};