import { travelConnectorService } from './travelConnector.service.js';

export const travelConnectorController = {
  async getAll(req, res, next) {
    try {
      const page = Math.max(1, parseInt(req.query.page, 10) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
      const search = req.query.search || undefined;
      const mode = req.query.mode || undefined;

      const [data, total] = await Promise.all([
        travelConnectorService.getAll({ page, limit, search, mode }),
        travelConnectorService.getAllCount({ search, mode }),
      ]);

      res.json({
        data: data.map(travelConnectorService.formatResponse),
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
      const connector = await travelConnectorService.getById(req.params.id);
      if (!connector) return res.status(404).json({ error: 'Travel connector not found' });
      res.json(travelConnectorService.formatResponse(connector));
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const { city1Id, city2Id, mode, timeInMinutes } = req.body;
      if (!city1Id || !city2Id || !mode || timeInMinutes === undefined) {
        return res.status(400).json({ error: 'city1Id, city2Id, mode, and timeInMinutes are required' });
      }
      if (city1Id === city2Id) {
        return res.status(400).json({ error: 'city1Id and city2Id must be different' });
      }
      const connector = await travelConnectorService.create({ city1Id, city2Id, mode, timeInMinutes });
      res.status(201).json(travelConnectorService.formatResponse(connector));
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const updated = await travelConnectorService.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'Travel connector not found' });
      res.json(travelConnectorService.formatResponse(updated));
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      const deleted = await travelConnectorService.delete(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Travel connector not found' });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
