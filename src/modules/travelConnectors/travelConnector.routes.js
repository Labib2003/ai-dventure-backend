import { Router } from 'express';
import { travelConnectorController } from './travelConnector.controller.js';

export const travelConnectorRoutes = Router();

travelConnectorRoutes.get('/', travelConnectorController.getAll);
travelConnectorRoutes.get('/:id', travelConnectorController.getById);
travelConnectorRoutes.post('/', travelConnectorController.create);
travelConnectorRoutes.put('/:id', travelConnectorController.update);
travelConnectorRoutes.delete('/:id', travelConnectorController.delete);
