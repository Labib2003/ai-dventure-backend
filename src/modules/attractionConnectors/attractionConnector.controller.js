import { attractionConnectorService } from './attractionConnector.service.js';

export const attractionConnectorController = {
  async getAll(req, res, next) {
    try {
      const page = Math.max(1, parseInt(req.query.page, 10) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
      const search = req.query.search || undefined;
      const mode = req.query.mode || undefined;

      const [data, total] = await Promise.all([
        attractionConnectorService.getAll({ page, limit, search, mode }),
        attractionConnectorService.getAllCount({ search, mode }),
      ]);

      res.json({
        data: data.map(attractionConnectorService.formatResponse),
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
      const connector = await attractionConnectorService.getById(req.params.id);
      if (!connector) return res.status(404).json({ error: 'Attraction connector not found' });
      res.json(attractionConnectorService.formatResponse(connector));
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const { hotelId, attractionId, mode, time } = req.body;
      if (!hotelId || !attractionId || !mode || time === undefined) {
        return res.status(400).json({ error: 'hotelId, attractionId, mode, and time are required' });
      }
      const connector = await attractionConnectorService.create({ hotelId, attractionId, mode, time });
      res.status(201).json(attractionConnectorService.formatResponse(connector));
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const updated = await attractionConnectorService.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'Attraction connector not found' });
      res.json(attractionConnectorService.formatResponse(updated));
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      const deleted = await attractionConnectorService.delete(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Attraction connector not found' });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
