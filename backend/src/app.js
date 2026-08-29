const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const pool = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const tareasRoutes = require('./routes/tareas.routes');
const categoriasRoutes = require('./routes/categorias.routes');
const etiquetasRoutes = require('./routes/etiquetas.routes');

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);

app.use(express.json());

app.use(morgan('dev'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', limiter);



app.get('/api/health', async (req, res, next) => {
  try {
    const resultado = await pool.query(
      'SELECT NOW() AS database_time'
    );

    res.status(200).json({
      status: 'ok',
      application: 'NexTask API',
      database: 'connected',
      databaseTime: resultado.rows[0].database_time,
    });
  } catch (error) {
    next(error);
  }
});


app.use('/api/auth', authRoutes);
app.use('/api/tareas', tareasRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/etiquetas', etiquetasRoutes);


app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
  });
});


app.use((error, req, res, next) => {
  const statusCode =
    error.statusCode ||
    error.status ||
    500;

  if (statusCode >= 500) {
    console.error(error);
  }

  const mensaje =
    error.type === 'entity.parse.failed'
      ? 'El JSON enviado no tiene un formato válido'
      : statusCode === 500
        ? 'Error interno del servidor'
        : error.message;

  res.status(statusCode).json({
    error: mensaje,

    ...(error.details && {
      detalles: error.details,
    }),
  });
});


module.exports = app;