import { Router } from 'express';
import { cityController } from './city.controller.js';

export const cityRoutes = Router();

cityRoutes.get('/search', cityController.search);
cityRoutes.get('/', cityController.getAll);
cityRoutes.get('/:id', cityController.getById);
cityRoutes.post('/', cityController.create);
cityRoutes.put('/:id', cityController.update);
cityRoutes.delete('/:id', cityController.delete);
