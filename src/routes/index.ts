import stationsRoutes from './stationsRoutes';
import operatorsRoutes from './operatorsRoutes';
import tripsRoutes from './tripsRoutes';

const routes = (app: any, db: any) => {
    stationsRoutes(app, db);
    operatorsRoutes(app, db);
    tripsRoutes(app, db);
};

export default routes;