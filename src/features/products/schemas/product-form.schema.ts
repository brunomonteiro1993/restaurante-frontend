import { z } from 'zod'

const urlOrEmptySchema = z.preprocess(
  (v) => (v === '' || v === null ? undefined : v),
  z
    .string()
    .max(12 * 1024 * 1024, 'Imagem muito grande.')
    .refine(
      (value) =>
        /^https?:\/\//i.test(value) ||
        /^data:image\/[a-zA-Z0-9.+-]+;base64,[A-Za-z0-9+/=]+$/.test(value),
      'Informe uma URL com http:// ou https://.',
    )
    .optional(),
)

export const createProductFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome do produto e obrigatorio.')
    .max(200, 'Nome muito longo.')
    .transform((s) => s.trim()),
  description: z
    .string()
    .max(2000, 'Descricao muito longa.')
    .optional()
    .transform((s) => (s === undefined ? undefined : s.trim())),
  price: z.coerce.number().positive('Preco deve ser maior que zero.'),
  imageUrl: urlOrEmptySchema,
  categoryId: z.string().uuid('Categoria invalida.'),
  isAvailable: z.boolean(),
})

export type CreateProductFormInput = z.input<typeof createProductFormSchema>
export type CreateProductFormValues = z.output<typeof createProductFormSchema>

export const updateProductFormSchema = createProductFormSchema

export type UpdateProductFormInput = z.input<typeof updateProductFormSchema>
export type UpdateProductFormValues = z.output<typeof updateProductFormSchema>
