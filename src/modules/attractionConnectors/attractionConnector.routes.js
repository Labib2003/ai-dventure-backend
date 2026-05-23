import { Router } from 'express';
import { attractionConnectorController } from './attractionConnector.controller.js';

export const attractionConnectorRoutes = Router();

attractionConnectorRoutes.get('/', attractionConnectorController.getAll);
attractionConnectorRoutes.get('/:id', attractionConnectorController.getById);
attractionConnectorRoutes.post('/', attractionConnectorController.create);
attractionConnectorRoutes.put('/:id', attractionConnectorController.update);
attractionConnectorRoutes.delete('/:id', attractionConnectorController.delete);
