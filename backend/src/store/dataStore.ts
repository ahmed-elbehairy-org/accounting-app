import type { AppState } from '../types/mudharaba.js'

export const db: AppState = {
  partners: [],
  rounds: [],
  investments: [],
  advances: [],
  liquidations: [],
  settlements: []
}

export function resetDb(): AppState {
  db.partners = []
  db.rounds = []
  db.investments = []
  db.advances = []
  db.liquidations = []
  db.settlements = []
  return db
}

export function getState(): AppState {
  return db
}
