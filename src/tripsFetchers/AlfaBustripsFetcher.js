const axios = require('axios');

const ALFA_BUS_ARROW_TRIP_SPLITTER = ' -> ';

const getAlfaBusTrips = (params) => {
  let {from, to, date, operatorId} = params;
  let {id: fromId, operatorKey: fromOperatorKey} = from;
  let {id: toId, operatorKey: toOperatorKey} = to;

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

          return tripFrom === fromOperatorKey
              && tripTo === toOperatorKey
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
      }).catch(error => {

      });
};

module.exports = {
  getAlfaBusTrips,
};