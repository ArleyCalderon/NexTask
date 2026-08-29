const { z } = require('zod');

const prioridadSchema = z.enum(['baja', 'media', 'alta'], {
  message: 'La prioridad debe ser baja, media o alta'
});

const fechaSchema = z
  .string()
  .regex(
    /^\d{4}-\d{2}-\d{2}$/,
    'La fecha debe tener formato YYYY-MM-DD'
  );

const crearTareaSchema = z.object({
  titulo: z
    .string()
    .trim()
    .min(1, 'El título es obligatorio'),

  descripcion: z
    .string()
    .trim()
    .optional()
    .nullable(),

  prioridad: prioridadSchema.optional().default('media'),

  fecha_vencimiento: fechaSchema
    .optional()
    .nullable(),

  categoria_id: z
    .number()
    .int('El ID de categoría debe ser un número entero')
    .positive('El ID de categoría debe ser positivo')
    .optional()
    .nullable()
});

const actualizarTareaSchema = z
  .object({
    titulo: z
      .string()
      .trim()
      .min(1, 'El título no puede estar vacío')
      .optional(),

    descripcion: z
      .string()
      .trim()
      .optional()
      .nullable(),

    prioridad: prioridadSchema.optional(),

    fecha_vencimiento: fechaSchema
      .optional()
      .nullable(),

    categoria_id: z
      .number()
      .int('El ID de categoría debe ser un número entero')
      .positive('El ID de categoría debe ser positivo')
      .optional()
      .nullable()
  })
  .refine(
    (datos) => Object.keys(datos).length > 0,
    {
      message: 'Debes enviar al menos un campo para actualizar'
    }
  );

const filtrosTareasSchema = z.object({
  completada: z
    .enum(['true', 'false'])
    .optional(),

  categoria: z
    .string()
    .regex(/^\d+$/, 'La categoría debe ser un ID válido')
    .optional(),

  prioridad: prioridadSchema.optional(),

  busqueda: z
    .string()
    .trim()
    .min(1, 'La búsqueda no puede estar vacía')
    .optional(),

  etiquetas: z
    .string()
    .trim()
    .min(1, 'Debes indicar al menos una etiqueta')
    .optional(),

  fecha_vencimiento: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2},\d{4}-\d{2}-\d{2}$/,
      'La fecha de vencimiento debe tener formato YYYY-MM-DD,YYYY-MM-DD'
    )
    .optional(),

  ordenar: z
    .enum([
      'creado_en',
      'fecha_vencimiento',
      'prioridad',
      'titulo'
    ])
    .optional(),

  direccion: z
    .enum(['asc', 'desc'])
    .optional()
});

module.exports = {
  crearTareaSchema,
  actualizarTareaSchema,
  filtrosTareasSchema
};