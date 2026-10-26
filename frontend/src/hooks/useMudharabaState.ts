import { useState, useEffect } from 'react'
import type { AppState, Partner, TradingRound, ShareInvestment, AdvanceLoan } from '../types/mudharaba'
import type { Project, CashflowItem, Product, ProductCostItem } from '../types/accounting'
import { loadAppState, saveAppState, resetToEmptyData } from '../services/storageService'

export function useMudharabaState() {
  const [state, setState] = useState<AppState>(() => loadAppState())
  useEffect(() => { saveAppState(state) }, [state])

  const addPartner = (d: Omit<Partner, 'id' | 'activeSharesCount' | 'totalInvestedCapital' | 'outstandingLoans'>) => {
    setState((p) => ({ ...p, partners: [{ ...d, id: `p-${Date.now()}`, activeSharesCount: 0, totalInvestedCapital: 0, outstandingLoans: 0 }, ...p.partners] }))
  }

  const addRound = (d: Omit<TradingRound, 'id' | 'totalAllocatedShares' | 'status'>) => {
    setState((p) => ({ ...p, rounds: [{ ...d, id: `r-${Date.now()}`, totalAllocatedShares: 0, status: 'active' }, ...p.rounds] }))
  }

  const allocateShares = (d: Omit<ShareInvestment, 'id'>) => {
    setState((prev) => ({
      ...prev,
      investments: [{ ...d, id: `inv-${Date.now()}` }, ...prev.investments],
      rounds: prev.rounds.map((r) => r.id === d.roundId ? { ...r, totalAllocatedShares: r.totalAllocatedShares + d.shareCount } : r),
      partners: prev.partners.map((p) => p.id === d.partnerId ? { ...p, activeSharesCount: p.activeSharesCount + d.shareCount, totalInvestedCapital: p.totalInvestedCapital + d.totalAmount } : p)
    }))
  }

  const addAdvance = (d: Omit<AdvanceLoan, 'id' | 'status' | 'settledAmount'>) => {
    setState((p) => ({
      ...p,
      advances: [{ ...d, id: `adv-${Date.now()}`, status: 'open', settledAmount: 0 }, ...p.advances],
      partners: p.partners.map((partner) => partner.id === d.partnerId ? { ...partner, outstandingLoans: partner.outstandingLoans + d.amount } : partner)
    }))
  }

  const settleAdvance = (id: string) => {
    setState((prev) => {
      const adv = prev.advances.find((a) => a.id === id)
      if (!adv) return prev
      return {
        ...prev,
        advances: prev.advances.map((a) => a.id === id ? { ...a, status: 'settled' as const, settledAmount: a.amount } : a),
        partners: prev.partners.map((p) => p.id === adv.partnerId ? { ...p, outstandingLoans: Math.max(0, p.outstandingLoans - adv.amount) } : p)
      }
    })
  }

  const addProject = (d: Omit<Project, 'id' | 'createdAt'>) => {
    setState((p) => ({ ...p, projects: [{ ...d, id: `proj-${Date.now()}`, createdAt: new Date().toISOString() }, ...p.projects] }))
  }

  const addCashflow = (d: Omit<CashflowItem, 'id'>) => {
    setState((p) => ({ ...p, cashflows: [{ ...d, id: `cf-${Date.now()}` }, ...p.cashflows] }))
  }

  const addProduct = (d: Omit<Product, 'id'>) => {
    setState((p) => ({ ...p, products: [{ ...d, id: `prod-${Date.now()}` }, ...p.products] }))
  }

  const addCostItem = (d: Omit<ProductCostItem, 'id'>) => {
    setState((p) => ({ ...p, costItems: [{ ...d, id: `pci-${Date.now()}` }, ...p.costItems] }))
  }

  const resetAllData = () => {
    if (window.confirm('هل تريد مسح جميع البيانات والبدء بحساب فارغ؟')) setState(resetToEmptyData())
  }

  return {
    state, setState, addPartner, addRound, allocateShares, addAdvance, settleAdvance,
    addProject, addCashflow, addProduct, addCostItem, resetAllData
  }
}
