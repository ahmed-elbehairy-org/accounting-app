import { useState, useEffect } from 'react'
import type { AppState, Partner, TradingRound, ShareInvestment, AdvanceLoan } from '../types/mudharaba'
import { loadAppState, saveAppState, resetToEmptyData } from '../services/storageService'

export function useMudharabaState() {
  const [state, setState] = useState<AppState>(() => loadAppState())

  useEffect(() => {
    saveAppState(state)
  }, [state])

  const addPartner = (data: Omit<Partner, 'id' | 'activeSharesCount' | 'totalInvestedCapital' | 'outstandingLoans'>) => {
    const newPartner: Partner = { ...data, id: `p-${Date.now()}`, activeSharesCount: 0, totalInvestedCapital: 0, outstandingLoans: 0 }
    setState((prev) => ({ ...prev, partners: [newPartner, ...prev.partners] }))
  }

  const addRound = (data: Omit<TradingRound, 'id' | 'totalAllocatedShares' | 'status'>) => {
    const newRound: TradingRound = { ...data, id: `r-${Date.now()}`, totalAllocatedShares: 0, status: 'active' }
    setState((prev) => ({ ...prev, rounds: [newRound, ...prev.rounds] }))
  }

  const allocateShares = (data: Omit<ShareInvestment, 'id'>) => {
    const newInv: ShareInvestment = { ...data, id: `inv-${Date.now()}` }
    setState((prev) => {
      const rounds = prev.rounds.map((r) => r.id === data.roundId ? { ...r, totalAllocatedShares: r.totalAllocatedShares + data.shareCount } : r)
      const partners = prev.partners.map((p) => p.id === data.partnerId ? { ...p, activeSharesCount: p.activeSharesCount + data.shareCount, totalInvestedCapital: p.totalInvestedCapital + data.totalAmount } : p)
      return { ...prev, investments: [newInv, ...prev.investments], rounds, partners }
    })
  }

  const addAdvance = (data: Omit<AdvanceLoan, 'id' | 'status' | 'settledAmount'>) => {
    const newAdv: AdvanceLoan = { ...data, id: `adv-${Date.now()}`, status: 'open', settledAmount: 0 }
    setState((prev) => ({
      ...prev,
      advances: [newAdv, ...prev.advances],
      partners: prev.partners.map((p) => p.id === data.partnerId ? { ...p, outstandingLoans: p.outstandingLoans + data.amount } : p)
    }))
  }

  const settleAdvance = (advanceId: string) => {
    setState((prev) => {
      const adv = prev.advances.find((a) => a.id === advanceId)
      if (!adv) return prev
      return {
        ...prev,
        advances: prev.advances.map((a) => a.id === advanceId ? { ...a, status: 'settled' as const, settledAmount: a.amount } : a),
        partners: prev.partners.map((p) => p.id === adv.partnerId ? { ...p, outstandingLoans: Math.max(0, p.outstandingLoans - adv.amount) } : p)
      }
    })
  }

  const resetAllData = () => {
    if (window.confirm('هل تريد مسح جميع البيانات والبدء بحساب فارغ؟')) {
      setState(resetToEmptyData())
    }
  }

  return { state, setState, addPartner, addRound, allocateShares, addAdvance, settleAdvance, resetAllData }
}
