import { z } from 'zod'

const userRoleSchema = z.enum(['ADMIN', 'MANAGER', 'WAITER', 'KITCHEN'])

export const createUserFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter ao menos 2 caracteres.')
    .max(120, 'Nome muito longo.')
    .transform((s) => s.trim()),
  email: z.string().email('Email invalido.').transform((s) => s.trim().toLowerCase()),
  password: z
    .string()
    .min(6, 'Senha deve ter ao menos 6 caracteres.')
    .max(100, 'Senha muito longa.'),
  role: userRoleSchema,
})

export type CreateUserFormValues = z.infer<typeof createUserFormSchema>

export const updateUserFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter ao menos 2 caracteres.')
    .max(120, 'Nome muito longo.')
    .transform((s) => s.trim()),
  email: z.string().email('Email invalido.').transform((s) => s.trim().toLowerCase()),
  role: userRoleSchema,
  isActive: z.boolean(),
})

export type UpdateUserFormValues = z.infer<typeof updateUserFormSchema>
