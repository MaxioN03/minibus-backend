const tripsFetcher = require('../tripsFetchers/tripsFetcher');
const stationRequest = require('../DAO/stationsDAO');
const operatorsRequest = require('../DAO/operatorsDAO');

const getTrips = (db, params) => {
  let {from, to, date} = params;

  let fromCityRequest = stationRequest.getOne(db, from);
  let toCityRequest = stationRequest.getOne(db, to);

  return new Promise((resolve) => {
    return Promise.all([fromCityRequest, toCityRequest])
        .then(stations => {
          let [fromCity, toCity] = stations;

          operatorsRequest.getAll(db).then(operators => {

            let tripsFetchersArray = operators.filter(
                operator => operator._id in fromCity.operatorsKeys
                    && operator._id in toCity.operatorsKeys)
                .map(operator => {

                  switch (operator.name) {
                    case 'Atlas':
                      return tripsFetcher.getAtlasBusTrips({
                        from: fromCity.operatorsKeys[operator._id],
                        to: toCity.operatorsKeys[operator._id],
                        date,
                      });
                    case 'Alfa Bus':
                      return tripsFetcher.getAlfaBusTrips({
                        from: fromCity.operatorsKeys[operator._id],
                        to: toCity.operatorsKeys[operator._id],
                        date,
                      });
                  }
                });

            return Promise.all(tripsFetchersArray)
                .then(trips => {
                  let resultTrips = trips.reduce((result, tripArray) => {
                    result.push(...tripArray);
                    return result;
                  }, []);

                  resolve(resultTrips);

                });
          });
        });
  })
};

module.exports = {
  getTrips,
};