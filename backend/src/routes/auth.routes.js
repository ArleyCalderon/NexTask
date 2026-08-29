const express = require('express');
const rateLimit = require('express-rate-limit');

const authController = require('../controllers/auth.controller');
const autenticar = require('../middlewares/auth.middleware');
const validar = require('../middlewares/validar.middleware');

const {
  registroSchema,
  loginSchema,
} = require('../validators/auth.validator');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error:
      'Demasiados intentos de inicio de sesión. Intenta nuevamente más tarde.',
  },
});

router.post(
  '/registro',
  validar(registroSchema),
  authController.registrar
);

router.post(
  '/login',
  loginLimiter,
  validar(loginSchema),
  authController.login
);

router.get(
  '/perfil',
  autenticar,
  authController.obtenerPerfil
);

module.exports = router;