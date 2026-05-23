import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { cityRoutes } from './modules/cities/city.routes.js';
import { travelConnectorRoutes } from './modules/travelConnectors/travelConnector.routes.js';
import { hotelRoutes } from './modules/hotels/hotel.routes.js';
import { attractionRoutes } from './modules/attractions/attraction.routes.js';
import { attractionConnectorRoutes } from './modules/attractionConnectors/attractionConnector.routes.js';

config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/cities', cityRoutes);
app.use('/api/travel-connectors', travelConnectorRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/attractions', attractionRoutes);
app.use('/api/attraction-connectors', attractionConnectorRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
