import { Pencil, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TableStatusBadge } from '@/features/tables/components/TableStatusBadge'
import type { Table } from '@/features/tables/types/tables.types'
import { formatDateTime } from '@/utils/format'

interface TableCardProps {
  table: Table
  onEdit: () => void
  onDelete: () => void
  busy?: boolean
}

export function TableCard({ table, onEdit, onDelete, busy }: TableCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
        <div>
          <CardTitle className="text-base">Mesa {table.number}</CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            Capacidade {table.capacity} lugares · Atualizado {formatDateTime(table.updatedAt)}
          </p>
        </div>
        <TableStatusBadge status={table.status} />
      </CardHeader>
      <CardContent className="space-y-3">
        {/* <p className="font-mono text-[11px] text-muted-foreground">ID {table.id}</p> */}
        <p className="text-xs text-muted-foreground">
          O codigo publico (QR) e gerado no servidor e nao e retornado nesta listagem.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" variant="outline" disabled={busy} onClick={onEdit}>
            <Pencil className="mr-1 size-3.5" />
            Editar
          </Button>
          <Button type="button" size="sm" variant="outline" disabled={busy} onClick={onDelete}>
            <Trash2 className="mr-1 size-3.5" />
            Excluir
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
