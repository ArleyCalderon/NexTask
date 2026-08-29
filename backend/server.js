require('dotenv').config();

const app = require('./src/app');
const pool = require('./src/config/db');

const PORT = process.env.PORT || 3000;

async function iniciarServidor() {
  try {
    await pool.query('SELECT 1');

    console.log('PostgreSQL conectado correctamente');

    app.listen(PORT, () => {
      console.log(`NexTask API ejecutándose en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('No fue posible conectar con PostgreSQL:', error.message);
    process.exit(1);
  }
}

iniciarServidor();