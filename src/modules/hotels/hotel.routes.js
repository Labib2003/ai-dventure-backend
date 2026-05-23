import { Router } from 'express';
import { hotelController } from './hotel.controller.js';

export const hotelRoutes = Router();

hotelRoutes.get('/', hotelController.getAll);
hotelRoutes.get('/:id', hotelController.getById);
hotelRoutes.post('/', hotelController.create);
hotelRoutes.put('/:id', hotelController.update);
hotelRoutes.delete('/:id', hotelController.delete);
