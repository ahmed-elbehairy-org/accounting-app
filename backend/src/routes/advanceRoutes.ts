import { Router } from 'express'
import { db } from '../store/dataStore.js'
import type { AdvanceLoan } from '../types/mudharaba.js'

export const advanceRouter = Router()

advanceRouter.get('/', (_req, res) => {
  res.json(db.advances)
})

advanceRouter.post('/', (req, res) => {
  const { partnerId, amount, deductionType, reason } = req.body
  const partner = db.partners.find((p) => p.id === partnerId)
  if (!partner || !amount) {
    res.status(400).json({ error: 'Valid partner and amount are required' })
    return
  }

  const parsedAmount = Number(amount)
  const newAdv: AdvanceLoan = {
    id: `adv-${Date.now()}`,
    partnerId,
    amount: parsedAmount,
    deductionType: deductionType || 'profit_advance',
    reason: (reason || '').trim(),
    status: 'open',
    date: new Date().toISOString().split('T')[0],
    settledAmount: 0
  }

  db.advances.unshift(newAdv)
  partner.outstandingLoans += parsedAmount
  res.status(201).json(newAdv)
})

advanceRouter.patch('/:id/settle', (req, res) => {
  const adv = db.advances.find((a) => a.id === req.params.id)
  if (!adv) {
    res.status(404).json({ error: 'Advance not found' })
    return
  }

  const partner = db.partners.find((p) => p.id === adv.partnerId)
  if (partner && adv.status === 'open') {
    partner.outstandingLoans = Math.max(0, partner.outstandingLoans - adv.amount)
  }

  adv.status = 'settled'
  adv.settledAmount = adv.amount
  res.json(adv)
})
