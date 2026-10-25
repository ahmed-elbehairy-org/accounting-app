import type { AppState } from '../types/mudharaba'


const STORAGE_KEY = 'mudharaba_app_state_v1'

export const SEED_DATA: AppState = {
  partners: [
    {
      id: 'p-1',
      name: 'أحمد محمود العوضي',
      phone: '01012345678',
      joinedDate: '2026-01-15',
      activeSharesCount: 50,
      totalInvestedCapital: 50000,
      outstandingLoans: 5000,
      notes: 'شريك استراتيجي - حصة أولى'
    },
    {
      id: 'p-2',
      name: 'طارق عبد السلام الشريف',
      phone: '01198765432',
      joinedDate: '2026-02-01',
      activeSharesCount: 30,
      totalInvestedCapital: 30000,
      outstandingLoans: 0,
      notes: 'مشارك في جولة الأجهزة الكهربائية'
    },
    {
      id: 'p-3',
      name: 'محمد إبراهيم الزيات',
      phone: '01234567890',
      joinedDate: '2026-03-10',
      activeSharesCount: 20,
      totalInvestedCapital: 20000,
      outstandingLoans: 2500,
      notes: 'سلفة مصروفات شخصية تحت حساب الأرباح'
    }
  ],
  rounds: [
    {
      id: 'r-1',
      title: 'جولة استيراد وتجارة الأقمشة بالجملة (ربيع 2026)',
      startDate: '2026-01-20',
      shareUnitPrice: 1000,
      targetShares: 100,
      totalAllocatedShares: 100,
      managerProfitCutPercent: 25, // 25% للمضارب
      status: 'active',
      description: 'شراء بضاعة أقمشة وتوزيعها على المحلات وتجار التجزئة'
    },
    {
      id: 'r-0',
      title: 'جولة الشتاء السابقة (الأجهزة المنزلية)',
      startDate: '2025-10-01',
      endDate: '2026-01-10',
      shareUnitPrice: 1000,
      targetShares: 80,
      totalAllocatedShares: 80,
      managerProfitCutPercent: 20,
      status: 'liquidated',
      description: 'تمت التصفية بنجاح وتوزيع الأرباح بالكامل'
    }
  ],
  investments: [
    {
      id: 'inv-1',
      partnerId: 'p-1',
      roundId: 'r-1',
      shareCount: 50,
      shareUnitPrice: 1000,
      totalAmount: 50000,
      date: '2026-01-21'
    },
    {
      id: 'inv-2',
      partnerId: 'p-2',
      roundId: 'r-1',
      shareCount: 30,
      shareUnitPrice: 1000,
      totalAmount: 30000,
      date: '2026-01-22'
    },
    {
      id: 'inv-3',
      partnerId: 'p-3',
      roundId: 'r-1',
      shareCount: 20,
      shareUnitPrice: 1000,
      totalAmount: 20000,
      date: '2026-01-23'
    }
  ],
  advances: [
    {
      id: 'adv-1',
      partnerId: 'p-1',
      amount: 5000,
      deductionType: 'profit_advance',
      status: 'open',
      date: '2026-03-01',
      reason: 'سحب نقدي تحت حساب أرباح جولة الأقمشة',
      settledAmount: 0
    },
    {
      id: 'adv-2',
      partnerId: 'p-3',
      amount: 2500,
      deductionType: 'capital_deduction',
      status: 'open',
      date: '2026-03-15',
      reason: 'سلفة طارئة تخصم من رأس المال عند التصفية',
      settledAmount: 0
    }
  ],
  liquidations: [
    {
      id: 'liq-0',
      roundId: 'r-0',
      liquidationDate: '2026-01-10',
      initialCapital: 80000,
      finalAssetValue: 104000, // +24,000 gross profit
      grossProfitOrLoss: 24000,
      managerProfit: 4800, // 20%
      investorsProfitPool: 19200, // 80%
      returnPerShare: 1240, // 1000 capital + 240 profit per share
      notes: 'تمت التصفية وتسليم جميع الشركاء حقوقهم بشيكات بنكية'
    }
  ],
  settlements: []
}

export function loadAppState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      saveAppState(SEED_DATA)
      return SEED_DATA
    }
    return JSON.parse(raw) as AppState
  } catch (err) {
    console.error('Failed to load state from localStorage', err)
    return SEED_DATA
  }
}

export function saveAppState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (err) {
    console.error('Failed to save state to localStorage', err)
  }
}

export function resetToSeedData(): AppState {
  saveAppState(SEED_DATA)
  return SEED_DATA
}
