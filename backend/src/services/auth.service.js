const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const pool = require('../config/db');
const AppError = require('../utils/AppError');

function generarToken(usuarioId) {
  return jwt.sign(
    {},
    process.env.JWT_SECRET,
    {
      subject: String(usuarioId),
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    }
  );
}

async function registrar({ nombre, email, password }) {
  const usuarioExistente = await pool.query(
    `
      SELECT id
      FROM usuarios
      WHERE LOWER(email) = $1
      LIMIT 1
    `,
    [email]
  );

  if (usuarioExistente.rowCount > 0) {
    throw new AppError(
      'Ya existe un usuario registrado con este correo',
      409
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  try {
    const resultado = await pool.query(
      `
        INSERT INTO usuarios (
          nombre,
          email,
          password_hash
        )
        VALUES ($1, $2, $3)
        RETURNING
          id,
          nombre,
          email,
          creado_en
      `,
      [nombre, email, passwordHash]
    );

    const usuario = resultado.rows[0];

    return {
      usuario,
      token: generarToken(usuario.id),
    };
  } catch (error) {
    if (error.code === '23505') {
      throw new AppError(
        'Ya existe un usuario registrado con este correo',
        409
      );
    }

    throw error;
  }
}

async function login({ email, password }) {
  const resultado = await pool.query(
    `
      SELECT
        id,
        nombre,
        email,
        password_hash,
        creado_en,
        ultimo_login_en
      FROM usuarios
      WHERE LOWER(email) = $1
      LIMIT 1
    `,
    [email]
  );

  if (resultado.rowCount === 0) {
    throw new AppError('Credenciales inválidas', 401);
  }

  const usuario = resultado.rows[0];

  const passwordCorrecta = await bcrypt.compare(
    password,
    usuario.password_hash
  );

  if (!passwordCorrecta) {
    throw new AppError('Credenciales inválidas', 401);
  }

  const usuarioActualizado = await pool.query(
    `
      UPDATE usuarios
      SET ultimo_login_en = NOW()
      WHERE id = $1
      RETURNING
        id,
        nombre,
        email,
        ultimo_login_en,
        creado_en
    `,
    [usuario.id]
  );

  return {
    usuario: usuarioActualizado.rows[0],
    token: generarToken(usuario.id),
  };
}

async function obtenerPerfil(usuarioId) {
  const resultado = await pool.query(
    `
      SELECT
        id,
        nombre,
        email,
        ultimo_login_en,
        creado_en,
        actualizado_en
      FROM usuarios
      WHERE id = $1
    `,
    [usuarioId]
  );

  if (resultado.rowCount === 0) {
    throw new AppError('Usuario no encontrado', 404);
  }

  return resultado.rows[0];
}

module.exports = {
  registrar,
  login,
  obtenerPerfil,
};