import { CashflowEntity } from '../../entities/cashflow.entity'

export interface CashflowSummary {
  totalInflow: number
  totalOutflow: number
  netCashflow: number
  inflowCount: number
  outflowCount: number
}

export function computeCashflowSummary(items: CashflowEntity[]): CashflowSummary {
  const active = items.filter((x) => !x.deletedAt)
  let totalInflow = 0
  let totalOutflow = 0
  let inflowCount = 0
  let outflowCount = 0

  for (const item of active) {
    const amount = Number(item.amount) || 0
    if (item.type === 'inflow') {
      totalInflow += amount
      inflowCount++
    } else if (item.type === 'outflow') {
      totalOutflow += amount
      outflowCount++
    }
  }

  return {
    totalInflow: Number(totalInflow.toFixed(2)),
    totalOutflow: Number(totalOutflow.toFixed(2)),
    netCashflow: Number((totalInflow - totalOutflow).toFixed(2)),
    inflowCount,
    outflowCount
  }
}

