export type WaiterCallStatus = 'OPEN' | 'ANSWERED' | 'CLOSED'

export interface WaiterCallListItem {
  id: string
  status: WaiterCallStatus
  createdAt: string
  updatedAt: string
  table: {
    id: string
    number: string
  }
}

export interface WaiterCallDetail {
  id: string
  status: WaiterCallStatus
  createdAt: string
  updatedAt: string
  table: {
    id: string
    number: string
    status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'DISABLED'
  }
}

export interface WaiterCallStatusUpdated {
  id: string
  status: WaiterCallStatus
  updatedAt: string
}

export interface WaiterCallFilters {
  status?: WaiterCallStatus
}
