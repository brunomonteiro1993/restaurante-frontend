import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email('E-mail invalido.'),
  password: z.string().min(6, 'A senha deve ter ao menos 6 caracteres.'),
})

export type LoginSchema = z.infer<typeof loginSchema>
