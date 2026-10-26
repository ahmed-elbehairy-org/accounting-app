export interface Project {
  id: string
  name: string
  code: string
  description?: string
  status: 'active' | 'completed' | 'paused'
  createdAt: string
}

export interface CashflowItem {
  id: string
  projectId: string
  type: 'inflow' | 'outflow'
  category: string
  amount: number
  entryDate: string
  description?: string
  linkedProductId?: string
}

export interface ProductCostItem {
  id: string
  productId: string
  cashflowId?: string
  costType: string
  allocatedAmount: number
}

export interface Product {
  id: string
  projectId: string
  name: string
  sku: string
  unitsProduced: number
  targetSellingPrice: number
  notes?: string
}
