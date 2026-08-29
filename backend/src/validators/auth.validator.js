const { z } = require('zod');

const emailSchema = z
  .string()
  .trim()
  .email('El correo electrónico no es válido')
  .max(255)
  .transform((value) => value.toLowerCase());

const registroSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede superar 100 caracteres'),

  email: emailSchema,

  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(72, 'La contraseña no puede superar 72 caracteres'),
});

const loginSchema = z.object({
  email: emailSchema,

  password: z
    .string()
    .min(1, 'La contraseña es obligatoria')
    .max(72),
});

module.exports = {
  registroSchema,
  loginSchema,
};