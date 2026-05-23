import { Router } from 'express';
import { attractionController } from './attraction.controller.js';

export const attractionRoutes = Router();

attractionRoutes.get('/', attractionController.getAll);
attractionRoutes.get('/:id', attractionController.getById);
attractionRoutes.post('/', attractionController.create);
attractionRoutes.put('/:id', attractionController.update);
attractionRoutes.delete('/:id', attractionController.delete);
