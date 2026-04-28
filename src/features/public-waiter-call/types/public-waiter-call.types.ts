export type PublicWaiterCallStatus = 'OPEN' | 'ANSWERED' | 'CLOSED'

export interface PublicWaiterCallStatusResult {
  hasOpenCall: boolean
  call: {
    id: string
    status: PublicWaiterCallStatus
    createdAt: string
  } | null
}

export interface CreatePublicWaiterCallPayload {
  restaurantSlug: string
  tableCode: string
}

export interface PublicWaiterCallCreatedResult {
  id: string
  status: PublicWaiterCallStatus
  alreadyOpen?: boolean
  createdAt: string
  table: {
    id: string
    number: string
  }
}
