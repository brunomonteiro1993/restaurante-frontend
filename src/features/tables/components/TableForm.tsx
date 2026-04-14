import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import type { TableStatus } from '@/features/tables/types/tables.types'

const statusOptions: Array<{ value: TableStatus; label: string }> = [
  { value: 'AVAILABLE', label: 'Disponivel' },
  { value: 'OCCUPIED', label: 'Ocupada' },
  { value: 'RESERVED', label: 'Reservada' },
  { value: 'DISABLED', label: 'Indisponivel' },
]

export function TableFormFields() {
  return (
    <div className="grid gap-4">
      <FormField
        name="number"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Numero</FormLabel>
            <FormControl>
              <Input placeholder="Ex.: 12" autoComplete="off" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="capacity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Capacidade (lugares)</FormLabel>
            <FormControl>
              <Input type="number" min={1} step={1} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
            <FormControl>
              <select
                className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                value={(field.value as TableStatus | undefined) ?? 'AVAILABLE'}
                onChange={(e) => field.onChange(e.target.value as TableStatus)}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
