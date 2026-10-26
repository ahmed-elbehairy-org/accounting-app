import type { AppState } from '../types/mudharaba'

const STORAGE_KEY = 'mudharaba_app_state_v1'

export const EMPTY_STATE: AppState = {
  partners: [],
  rounds: [],
  investments: [],
  advances: [],
  liquidations: [],
  settlements: [],
  projects: [],
  cashflows: [],
  products: [],
  costItems: []
}

export function loadAppState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      saveAppState(EMPTY_STATE)
      return EMPTY_STATE
    }
    const parsed = JSON.parse(raw) as AppState
    return {
      ...EMPTY_STATE,
      ...parsed
    }
  } catch (err) {
    console.error('Failed to load state', err)
    return EMPTY_STATE
  }
}

export function saveAppState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (err) {
    console.error('Failed to save state', err)
  }
}

export function resetToEmptyData(): AppState {
  saveAppState(EMPTY_STATE)
  return EMPTY_STATE
}
