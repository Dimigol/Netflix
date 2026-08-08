export const notFoundHandler = (req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
};

export const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(e => e.message).join(', ');
    return res.status(400).json({ error: message });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Identificador inválido' });
  }

  if (err.code === 11000) {
    return res.status(409).json({ error: 'Registro já existe' });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: statusCode < 500 ? err.message : 'Erro interno do servidor'
  });
};
