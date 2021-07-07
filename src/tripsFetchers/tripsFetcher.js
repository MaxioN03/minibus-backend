const {getAlfaBusTrips} = require('./AlfaBustripsFetcher/AlfaBustripsFetcher');
const {getAtlasBusTrips} = require('./AtlasTripsFetcher');

module.exports = {
  getAlfaBusTrips,
  getAtlasBusTrips
};