import { z } from 'zod'

const tableStatusEnum = z.enum(['AVAILABLE', 'OCCUPIED', 'RESERVED', 'DISABLED'])

export const createTableFormSchema = z.object({
  number: z
    .string()
    .min(1, 'Numero da mesa e obrigatorio.')
    .max(50, 'Numero muito longo.')
    .transform((s) => s.trim()),
  capacity: z.coerce.number().int('Capacidade deve ser um numero inteiro.').positive('Capacidade deve ser positiva.'),
  status: tableStatusEnum.optional(),
})

export type CreateTableFormValues = z.infer<typeof createTableFormSchema>

export const updateTableFormSchema = z.object({
  number: z
    .string()
    .min(1, 'Numero da mesa e obrigatorio.')
    .max(50, 'Numero muito longo.')
    .transform((s) => s.trim()),
  capacity: z.coerce.number().int('Capacidade deve ser um numero inteiro.').positive('Capacidade deve ser positiva.'),
  status: tableStatusEnum,
})

export type UpdateTableFormValues = z.infer<typeof updateTableFormSchema>
