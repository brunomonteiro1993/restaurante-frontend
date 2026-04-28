import { z } from 'zod'

export const createCategoryFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome da categoria e obrigatorio.')
    .max(120, 'Nome muito longo.')
    .transform((s) => s.trim()),
  description: z
    .string()
    .max(1000, 'Descricao muito longa.')
    .optional()
    .transform((s) => (s === undefined ? undefined : s.trim())),
})

export type CreateCategoryFormValues = z.infer<typeof createCategoryFormSchema>

export const updateCategoryFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome da categoria e obrigatorio.')
    .max(120, 'Nome muito longo.')
    .transform((s) => s.trim()),
  description: z
    .string()
    .max(1000, 'Descricao muito longa.')
    .optional()
    .transform((s) => (s === undefined ? '' : s.trim())),
  isActive: z.boolean(),
})

export type UpdateCategoryFormValues = z.infer<typeof updateCategoryFormSchema>
