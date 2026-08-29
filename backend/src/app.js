const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const pool = require('./config/db');

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


app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
  });
});


app.use((error, req, res, next) => {
  console.error(error);

  res.status(500).json({
    error: 'Error interno del servidor',
  });
});


module.exports = app;