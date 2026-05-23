export function errorHandler(err, req, res, _next) {
  console.error(err);

  if (err.code === '23505') {
    return res.status(409).json({ error: 'Resource already exists' });
  }

  if (err.code === '23503') {
    return res.status(400).json({ error: 'Referenced resource does not exist' });
  }

  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Internal server error',
  });
}

export function notFound(req, res) {
  res.status(404).json({ error: `Route ${req.method} ${req.url} not found` });
}
