import { cityService } from './city.service.js';

export const cityController = {
  async getAll(req, res, next) {
    try {
      const page = Math.max(1, parseInt(req.query.page, 10) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
      const search = req.query.search || undefined;

      const [data, total] = await Promise.all([
        cityService.getAll({ page, limit, search }),
        cityService.getAllCount({ search }),
      ]);

      res.json({
        data: data.map(cityService.formatResponse),
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
      const city = await cityService.getById(req.params.id);
      if (!city) return res.status(404).json({ error: 'City not found' });
      res.json(cityService.formatResponse(city));
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const { name, descp } = req.body;
      if (!name || !descp) {
        return res.status(400).json({ error: 'name and descp are required' });
      }
      const city = await cityService.create({ name, descp });
      res.status(201).json(cityService.formatResponse(city));
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const updated = await cityService.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'City not found' });
      res.json(cityService.formatResponse(updated));
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      const deleted = await cityService.delete(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'City not found' });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },

  async search(req, res, next) {
    try {
      const query = req.query.q || '';
      const cities = await cityService.search(query);
      res.json(cities.map(cityService.formatResponse));
    } catch (err) {
      next(err);
    }
  },
};
