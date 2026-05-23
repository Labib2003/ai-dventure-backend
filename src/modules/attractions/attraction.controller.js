import { attractionService } from './attraction.service.js';

export const attractionController = {
  async getAll(req, res, next) {
    try {
      const page = Math.max(1, parseInt(req.query.page, 10) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
      const search = req.query.search || undefined;
      const category = req.query.category || undefined;

      const [data, total] = await Promise.all([
        attractionService.getAll({ page, limit, search, category }),
        attractionService.getAllCount({ search, category }),
      ]);

      res.json({
        data: data.map(attractionService.formatResponse),
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
      const attraction = await attractionService.getById(req.params.id);
      if (!attraction) return res.status(404).json({ error: 'Attraction not found' });
      res.json(attractionService.formatResponse(attraction));
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const { cityId, name, descp, lat, long, category, rating, openingHours, entryFee, duration, imageUrl } = req.body;
      if (!cityId || !name || !descp || lat === undefined || long === undefined || !category || rating === undefined || !openingHours || entryFee === undefined || !duration || !imageUrl) {
        return res.status(400).json({ error: 'All attraction fields are required' });
      }
      const attraction = await attractionService.create({
        cityId, name, descp, lat, long, category, rating, openingHours, entryFee, duration, imageUrl,
      });
      res.status(201).json(attractionService.formatResponse(attraction));
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const updated = await attractionService.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'Attraction not found' });
      res.json(attractionService.formatResponse(updated));
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      const deleted = await attractionService.delete(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Attraction not found' });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
