const { z } = require('zod');

const esFechaValida = (valor) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
    return false;
  }

  const fecha = new Date(`${valor}T00:00:00Z`);

  return (
    !Number.isNaN(fecha.getTime()) &&
    fecha.toISOString().slice(0, 10) === valor
  );
};


const prioridadSchema = z.enum(['baja', 'media', 'alta'], {
  message: 'La prioridad debe ser baja, media o alta'
});

const fechaSchema = z
  .string()
  .refine(
    esFechaValida,
    'La fecha debe ser válida y tener formato YYYY-MM-DD'
  );

const crearTareaSchema = z.object({
  titulo: z
    .string()
    .trim()
    .min(1, 'El título es obligatorio')
    .max(200, 'El título no puede superar 200 caracteres'),

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
    .max(200, 'El título no puede superar 200 caracteres')
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
    .superRefine((valor, ctx) => {
      const fechas = valor.split(',');

      if (
        fechas.length !== 2 ||
        !fechas.every(esFechaValida)
      ) {
        ctx.addIssue({
          code: 'custom',
          message:
            'La fecha de vencimiento debe tener dos fechas válidas YYYY-MM-DD,YYYY-MM-DD'
        });

        return;
      }

      const [desde, hasta] = fechas;

      if (desde > hasta) {
        ctx.addIssue({
          code: 'custom',
          message:
            'La fecha inicial no puede ser posterior a la fecha final'
        });
      }
    })
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

const tareaIdSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'El ID de la tarea debe ser válido')
});

const tareaEtiquetaParamsSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'El ID de la tarea debe ser válido'),

  etiquetaId: z
    .string()
    .regex(/^\d+$/, 'El ID de la etiqueta debe ser válido')
});

module.exports = {
  crearTareaSchema,
  actualizarTareaSchema,
  filtrosTareasSchema,
  tareaIdSchema,
  tareaEtiquetaParamsSchema
};