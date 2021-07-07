import stationsRoutes from './stationsRoutes';
// const tripsRoutes = require('./tripsRoutes');
// const operatorsRoutes = require('./operatorsRoutes');

const routes = (app: any, db: any) => {
    stationsRoutes(app, db);
    // tripsRoutes(app, db);
    // operatorsRoutes(app, db);
};

export default routes;