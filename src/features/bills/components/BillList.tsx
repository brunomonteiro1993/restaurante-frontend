import { BillCard } from '@/features/bills/components/BillCard'
import type { BillListItem } from '@/features/bills/types/bills.types'

interface BillListProps {
  bills: BillListItem[]
  pendingCloseId?: string
  pendingPayId?: string
  onDetails: (bill: BillListItem) => void
  onClose: (bill: BillListItem) => void
  onPay: (bill: BillListItem) => void
}

export function BillList({ bills, pendingCloseId, pendingPayId, onDetails, onClose, onPay }: BillListProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {bills.map((bill) => (
        <BillCard
          key={bill.id}
          bill={bill}
          onDetails={() => onDetails(bill)}
          onClose={() => onClose(bill)}
          onPay={() => onPay(bill)}
          closePending={pendingCloseId === bill.id}
          payPending={pendingPayId === bill.id}
        />
      ))}
    </div>
  )
}
