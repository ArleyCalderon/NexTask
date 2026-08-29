const { z } = require('zod');

const crearEtiquetaSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, 'El nombre es obligatorio')
    .max(50, 'El nombre no puede superar 50 caracteres')
});

module.exports = {
  crearEtiquetaSchema
};