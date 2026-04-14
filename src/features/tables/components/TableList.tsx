import { TableCard } from '@/features/tables/components/TableCard'
import type { Table } from '@/features/tables/types/tables.types'

interface TableListProps {
  tables: Table[]
  busy?: boolean
  onEdit: (table: Table) => void
  onDelete: (table: Table) => void
}

export function TableList({ tables, busy, onEdit, onDelete }: TableListProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {tables.map((table) => (
        <TableCard
          key={table.id}
          table={table}
          busy={busy}
          onEdit={() => onEdit(table)}
          onDelete={() => onDelete(table)}
        />
      ))}
    </div>
  )
}
