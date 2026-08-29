const { z } = require('zod');

const colorSchema = z
  .string()
  .regex(
    /^#[0-9A-Fa-f]{6}$/,
    'El color debe tener formato hexadecimal #RRGGBB'
  );

const crearCategoriaSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, 'El nombre es obligatorio')
    .max(80, 'El nombre no puede superar 80 caracteres'),

  color: colorSchema
    .optional()
    .default('#6366F1')
});

const actualizarCategoriaSchema = z
  .object({
    nombre: z
      .string()
      .trim()
      .min(1, 'El nombre no puede estar vacío')
      .max(80, 'El nombre no puede superar 80 caracteres')
      .optional(),

    color: colorSchema.optional()
  })
  .refine(
    (datos) => Object.keys(datos).length > 0,
    {
      message: 'Debes enviar al menos un campo para actualizar'
    }
  );

module.exports = {
  crearCategoriaSchema,
  actualizarCategoriaSchema
};