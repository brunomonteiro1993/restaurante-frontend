import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

interface UserFormFieldsProps {
  includePasswordField: boolean
  includeStatusField: boolean
}

export function UserFormFields({ includePasswordField, includeStatusField }: UserFormFieldsProps) {
  return (
    <div className="grid gap-4">
      <FormField
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome</FormLabel>
            <FormControl>
              <Input placeholder="Nome completo" autoComplete="off" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="usuario@restaurante.com" autoComplete="off" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {includePasswordField && (
        <FormField
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Minimo 6 caracteres" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        name="role"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Role</FormLabel>
            <FormControl>
              <select
                className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2 text-sm"
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
              >
                <option value="ADMIN">Admin</option>
                <option value="MANAGER">Gerente</option>
                <option value="WAITER">Garcom</option>
                <option value="KITCHEN">Cozinha</option>
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {includeStatusField && (
        <FormField
          name="isActive"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <select
                  className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2 text-sm"
                  value={field.value ? 'ACTIVE' : 'INACTIVE'}
                  onChange={(e) => field.onChange(e.target.value === 'ACTIVE')}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                >
                  <option value="ACTIVE">Ativo</option>
                  <option value="INACTIVE">Inativo</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  )
}
