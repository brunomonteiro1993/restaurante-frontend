import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

interface CategoryFormFieldsProps {
  includeActiveField: boolean
}

export function CategoryFormFields({ includeActiveField }: CategoryFormFieldsProps) {
  return (
    <div className="grid gap-4">
      <FormField
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome</FormLabel>
            <FormControl>
              <Input placeholder="Ex.: Bebidas" autoComplete="off" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descricao</FormLabel>
            <FormControl>
              <textarea
                className="min-h-20 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Opcional"
                value={field.value ?? ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {includeActiveField && (
        <FormField
          name="isActive"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <select
                  className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                  value={field.value ? 'ACTIVE' : 'INACTIVE'}
                  onChange={(e) => field.onChange(e.target.value === 'ACTIVE')}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                >
                  <option value="ACTIVE">Ativa</option>
                  <option value="INACTIVE">Inativa</option>
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
