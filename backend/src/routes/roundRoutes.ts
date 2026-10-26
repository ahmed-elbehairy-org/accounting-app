import { Router } from 'express'
import { db } from '../store/dataStore.js'
import type { TradingRound, ShareInvestment } from '../types/mudharaba.js'

export const roundRouter = Router()

roundRouter.get('/', (_req, res) => {
  res.json(db.rounds)
})

roundRouter.post('/', (req, res) => {
  const { title, shareUnitPrice, targetShares, managerProfitCutPercent, description } = req.body
  if (!title) {
    res.status(400).json({ error: 'Title is required' })
    return
  }

  const newRound: TradingRound = {
    id: `r-${Date.now()}`,
    title: title.trim(),
    startDate: new Date().toISOString().split('T')[0],
    shareUnitPrice: Number(shareUnitPrice) || 1000,
    targetShares: Number(targetShares) || 100,
    totalAllocatedShares: 0,
    managerProfitCutPercent: Number(managerProfitCutPercent) || 25,
    status: 'active',
    description: (description || '').trim()
  }

  db.rounds.unshift(newRound)
  res.status(201).json(newRound)
})

roundRouter.post('/:id/allocate', (req, res) => {
  const { partnerId, shareCount } = req.body
  const round = db.rounds.find((r) => r.id === req.params.id)
  const partner = db.partners.find((p) => p.id === partnerId)

  if (!round || !partner) {
    res.status(404).json({ error: 'Round or Partner not found' })
    return
  }

  const count = Number(shareCount)
  const totalAmount = count * round.shareUnitPrice

  const inv: ShareInvestment = {
    id: `inv-${Date.now()}`,
    partnerId,
    roundId: round.id,
    shareCount: count,
    shareUnitPrice: round.shareUnitPrice,
    totalAmount,
    date: new Date().toISOString().split('T')[0]
  }

  db.investments.unshift(inv)
  round.totalAllocatedShares += count
  partner.activeSharesCount += count
  partner.totalInvestedCapital += totalAmount

  res.status(201).json({ investment: inv, round, partner })
})
