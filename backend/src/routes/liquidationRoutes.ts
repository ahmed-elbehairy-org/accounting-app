import { Router } from 'express'
import { db, resetDb } from '../store/dataStore.js'
import type { Liquidation, SettlementPayout } from '../types/mudharaba.js'

export const liquidationRouter = Router()

liquidationRouter.get('/', (_req, res) => {
  res.json({ liquidations: db.liquidations, settlements: db.settlements })
})

liquidationRouter.get('/state', (_req, res) => {
  res.json(db)
})

liquidationRouter.post('/reset', (_req, res) => {
  res.json(resetDb())
})

liquidationRouter.post('/execute', (req, res) => {
  const { roundId, finalAssetValue, notes } = req.body
  const round = db.rounds.find((r) => r.id === roundId)
  if (!round) {
    res.status(404).json({ error: 'Round not found' })
    return
  }

  const roundInvs = db.investments.filter((i) => i.roundId === roundId)
  const totalShares = roundInvs.reduce((sum, i) => sum + i.shareCount, 0)
  const initialCapital = roundInvs.reduce((sum, i) => sum + i.totalAmount, 0)
  const assetVal = Number(finalAssetValue)
  const grossProfit = assetVal - initialCapital
  const isProfit = grossProfit > 0
  const managerProfit = isProfit ? grossProfit * (round.managerProfitCutPercent / 100) : 0
  const investorsProfitPool = isProfit ? grossProfit - managerProfit : grossProfit
  const profitPerShare = totalShares > 0 ? investorsProfitPool / totalShares : 0
  const date = new Date().toISOString().split('T')[0]
  const liqId = `liq-${Date.now()}`

  const liquidation: Liquidation = {
    id: liqId, roundId, liquidationDate: date, initialCapital,
    finalAssetValue: assetVal, grossProfitOrLoss: grossProfit, managerProfit,
    investorsProfitPool, returnPerShare: totalShares > 0 ? assetVal / totalShares : 0, notes
  }

  const payouts: SettlementPayout[] = db.partners.map((partner) => {
    const pInvs = roundInvs.filter((i) => i.partnerId === partner.id)
    const shares = pInvs.reduce((sum, i) => sum + i.shareCount, 0)
    if (shares === 0) return null

    const capInvested = pInvs.reduce((sum, i) => sum + i.totalAmount, 0)
    const profit = isProfit ? shares * profitPerShare : 0
    const capReturned = isProfit ? capInvested : Math.max(0, capInvested + shares * profitPerShare)
    const gross = capReturned + profit
    const openAdvs = db.advances.filter((a) => a.partnerId === partner.id && a.status === 'open')
    const totAdv = openAdvs.reduce((sum, a) => sum + (a.amount - a.settledAmount), 0)

    partner.activeSharesCount = Math.max(0, partner.activeSharesCount - shares)
    partner.outstandingLoans = Math.max(0, partner.outstandingLoans - totAdv)

    return {
      id: `settle-${Date.now()}-${partner.id}`, liquidationId: liqId, roundId,
      partnerId: partner.id, sharesCount: shares, capitalReturned: capReturned,
      profitShare: profit, grossEntitlement: gross, deductedAdvances: totAdv,
      netPayable: gross - totAdv, paid: false
    }
  }).filter((p): p is SettlementPayout => p !== null)

  round.status = 'liquidated'
  round.endDate = date
  db.liquidations.unshift(liquidation)
  db.settlements.push(...payouts)

  res.status(201).json({ liquidation, settlements: payouts })
})
