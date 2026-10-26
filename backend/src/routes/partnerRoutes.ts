import { Router } from 'express'
import { db } from '../store/dataStore.js'
import type { Partner } from '../types/mudharaba.js'

export const partnerRouter = Router()

partnerRouter.get('/', (_req, res) => {
  res.json(db.partners)
})

partnerRouter.post('/', (req, res) => {
  const { name, phone, notes } = req.body
  if (!name) {
    res.status(400).json({ error: 'Name is required' })
    return
  }

  const newPartner: Partner = {
    id: `p-${Date.now()}`,
    name: name.trim(),
    phone: (phone || '').trim(),
    notes: (notes || '').trim(),
    joinedDate: new Date().toISOString().split('T')[0],
    activeSharesCount: 0,
    totalInvestedCapital: 0,
    outstandingLoans: 0
  }

  db.partners.unshift(newPartner)
  res.status(201).json(newPartner)
})

partnerRouter.get('/:id', (req, res) => {
  const partner = db.partners.find((p) => p.id === req.params.id)
  if (!partner) {
    res.status(404).json({ error: 'Partner not found' })
    return
  }
  res.json(partner)
})
