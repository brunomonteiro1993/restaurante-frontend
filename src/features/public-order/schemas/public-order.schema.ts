import { z } from 'zod'

export const publicOrderConfirmSchema = z.object({
  customerName: z
    .string()
    .max(120, 'Nome muito longo.')
    .optional()
    .transform((v) => (v === undefined ? undefined : v.trim())),
  notes: z
    .string()
    .max(1000, 'Observacao muito longa.')
    .optional()
    .transform((v) => (v === undefined ? undefined : v.trim())),
})

export type PublicOrderConfirmValues = z.infer<typeof publicOrderConfirmSchema>
