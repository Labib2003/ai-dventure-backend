import { hotelService } from './hotel.service.js';

export const hotelController = {
  async getAll(req, res, next) {
    try {
      const page = Math.max(1, parseInt(req.query.page, 10) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
      const search = req.query.search || undefined;
      const category = req.query.category || undefined;

      const [data, total] = await Promise.all([
        hotelService.getAll({ page, limit, search, category }),
        hotelService.getAllCount({ search, category }),
      ]);

      res.json({
        data: data.map(hotelService.formatResponse),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const hotel = await hotelService.getById(req.params.id);
      if (!hotel) return res.status(404).json({ error: 'Hotel not found' });
      res.json(hotelService.formatResponse(hotel));
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const { cityId, name, category, price } = req.body;
      if (!cityId || !name || !category || price === undefined) {
        return res.status(400).json({ error: 'cityId, name, category, and price are required' });
      }
      const hotel = await hotelService.create({ cityId, name, category, price });
      res.status(201).json(hotelService.formatResponse(hotel));
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const updated = await hotelService.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'Hotel not found' });
      res.json(hotelService.formatResponse(updated));
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      const deleted = await hotelService.delete(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Hotel not found' });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
