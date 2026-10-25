import { useState, useEffect } from 'react'
import {
  Users,
  Briefcase,
  HandCoins,
  Calculator,
  LayoutDashboard,
  Receipt,
  RotateCcw
} from 'lucide-react'
import type { AppState, Partner, TradingRound, ShareInvestment, AdvanceLoan } from './types/mudharaba'

import { loadAppState, saveAppState, resetToSeedData } from './services/storageService'
import { PartnerList } from './components/partners/PartnerList'
import { RoundList } from './components/rounds/RoundList'
import { AdvancesList } from './components/advances/AdvancesList'
import { LiquidationWizard } from './components/liquidation/LiquidationWizard'

type TabType = 'dashboard' | 'partners' | 'rounds' | 'advances' | 'liquidations'

export default function App() {
  const [state, setState] = useState<AppState>(() => loadAppState())
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [activeLiquidationRound, setActiveLiquidationRound] = useState<TradingRound | null>(null)

  // Save to localStorage whenever state updates
  useEffect(() => {
    saveAppState(state)
  }, [state])

  // Handlers
  const handleAddPartner = (partnerData: Omit<Partner, 'id' | 'activeSharesCount' | 'totalInvestedCapital' | 'outstandingLoans'>) => {
    const newPartner: Partner = {
      ...partnerData,
      id: `p-${Date.now()}`,
      activeSharesCount: 0,
      totalInvestedCapital: 0,
      outstandingLoans: 0
    }
    setState((prev) => ({
      ...prev,
      partners: [newPartner, ...prev.partners]
    }))
  }

  const handleAddRound = (roundData: Omit<TradingRound, 'id' | 'totalAllocatedShares' | 'status'>) => {
    const newRound: TradingRound = {
      ...roundData,
      id: `r-${Date.now()}`,
      totalAllocatedShares: 0,
      status: 'active'
    }
    setState((prev) => ({
      ...prev,
      rounds: [newRound, ...prev.rounds]
    }))
  }

  const handleAllocateShares = (investmentData: Omit<ShareInvestment, 'id'>) => {
    const newInv: ShareInvestment = {
      ...investmentData,
      id: `inv-${Date.now()}`
    }

    setState((prev) => {
      // Update round allocated shares
      const updatedRounds = prev.rounds.map((r) =>
        r.id === investmentData.roundId
          ? { ...r, totalAllocatedShares: r.totalAllocatedShares + investmentData.shareCount }
          : r
      )

      // Update partner active shares and invested capital
      const updatedPartners = prev.partners.map((p) =>
        p.id === investmentData.partnerId
          ? {
              ...p,
              activeSharesCount: p.activeSharesCount + investmentData.shareCount,
              totalInvestedCapital: p.totalInvestedCapital + investmentData.totalAmount
            }
          : p
      )

      return {
        ...prev,
        investments: [newInv, ...prev.investments],
        rounds: updatedRounds,
        partners: updatedPartners
      }
    })
  }

  const handleAddAdvance = (advanceData: Omit<AdvanceLoan, 'id' | 'status' | 'settledAmount'>) => {
    const newAdv: AdvanceLoan = {
      ...advanceData,
      id: `adv-${Date.now()}`,
      status: 'open',
      settledAmount: 0
    }

    setState((prev) => {
      const updatedPartners = prev.partners.map((p) =>
        p.id === advanceData.partnerId
          ? { ...p, outstandingLoans: p.outstandingLoans + advanceData.amount }
          : p
      )

      return {
        ...prev,
        advances: [newAdv, ...prev.advances],
        partners: updatedPartners
      }
    })
  }

  const handleSettleAdvance = (advanceId: string) => {
    setState((prev) => {
      const adv = prev.advances.find((a) => a.id === advanceId)
      if (!adv) return prev

      const updatedAdvances = prev.advances.map((a) =>
        a.id === advanceId ? { ...a, status: 'settled' as const, settledAmount: a.amount } : a
      )

      const updatedPartners = prev.partners.map((p) =>
        p.id === adv.partnerId
          ? { ...p, outstandingLoans: Math.max(0, p.outstandingLoans - adv.amount) }
          : p
      )

      return {
        ...prev,
        advances: updatedAdvances,
        partners: updatedPartners
      }
    })
  }

  const handleResetData = () => {
    if (window.confirm('هل تريد استعادة البيانات التجريبية الأولية؟')) {
      const fresh = resetToSeedData()
      setState(fresh)
    }
  }

  // Dashboard Aggregates
  const activeRounds = state.rounds.filter((r) => r.status === 'active')

  const totalActiveCapital = state.investments
    .filter((inv) => {
      const round = state.rounds.find((r) => r.id === inv.roundId)
      return round?.status === 'active'
    })
    .reduce((sum, inv) => sum + inv.totalAmount, 0)

  const totalOpenLoans = state.advances
    .filter((a) => a.status === 'open')
    .reduce((sum, a) => sum + (a.amount - a.settledAmount), 0)

  const totalRealizedProfits = state.liquidations.reduce((sum, l) => sum + l.grossProfitOrLoss, 0)
  const totalManagerProfit = state.liquidations.reduce((sum, l) => sum + l.managerProfit, 0)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white" dir="rtl">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/70 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Receipt className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight leading-none">
                منظومة إدارة المضاربة والشراكات
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                إدارة الأسهم • السلف والمسحوبات • المقاصة وتوزيع الأرباح
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleResetData}
              title="إعادة ضبط البيانات للتجربة"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs transition border border-slate-700/50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">بيانات افتراضية</span>
            </button>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              جاهز للتشغيل
            </span>
          </div>
        </div>
      </header>

      {/* Tabs Navigation */}
      <nav className="border-b border-slate-800/60 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex overflow-x-auto gap-2 py-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition shrink-0 ${
              activeTab === 'dashboard'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            لوحة المتابعة العامة
          </button>

          <button
            onClick={() => setActiveTab('partners')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition shrink-0 ${
              activeTab === 'partners'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Users className="w-4 h-4" />
            الشركاء والأسهم ({state.partners.length})
          </button>

          <button
            onClick={() => setActiveTab('rounds')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition shrink-0 ${
              activeTab === 'rounds'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            جولات المضاربة ({state.rounds.length})
          </button>

          <button
            onClick={() => setActiveTab('advances')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition shrink-0 ${
              activeTab === 'advances'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <HandCoins className="w-4 h-4" />
            السلف والمسحوبات ({state.advances.filter((a) => a.status === 'open').length})
          </button>

          <button
            onClick={() => setActiveTab('liquidations')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition shrink-0 ${
              activeTab === 'liquidations'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Calculator className="w-4 h-4" />
            التصفية وتوزيع الأرباح ({state.liquidations.length})
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800">
                <span className="text-xs text-slate-400 block font-medium">رأس المال النشط قيد التجارة</span>
                <div className="mt-2 text-2xl font-bold text-white tracking-tight">
                  ${totalActiveCapital.toLocaleString()}
                </div>
                <span className="text-xs text-indigo-400 mt-1 block">في {activeRounds.length} جولات نشطة</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800">
                <span className="text-xs text-slate-400 block font-medium">سلف ومسحوبات مفتوحة</span>
                <div className="mt-2 text-2xl font-bold text-rose-400 tracking-tight">
                  ${totalOpenLoans.toLocaleString()}
                </div>
                <span className="text-xs text-slate-400 mt-1 block">تخصم تلقائياً عند التصفية</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800">
                <span className="text-xs text-slate-400 block font-medium">أرباح مصفاة وموزعة تاريخياً</span>
                <div className="mt-2 text-2xl font-bold text-emerald-400 tracking-tight">
                  +${totalRealizedProfits.toLocaleString()}
                </div>
                <span className="text-xs text-slate-400 mt-1 block">من الجولات المكتملة</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800">
                <span className="text-xs text-slate-400 block font-medium">صافي حصة المضارب (أرباحك)</span>
                <div className="mt-2 text-2xl font-bold text-cyan-400 tracking-tight">
                  +${totalManagerProfit.toLocaleString()}
                </div>
                <span className="text-xs text-slate-400 mt-1 block">أتعاب إدارة التجارة المحققة</span>
              </div>
            </div>

            {/* Quick Actions / Shortcuts */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900/60 to-slate-900/40 border border-indigo-900/40 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-100 text-lg">العمليات السريعة</h3>
                <p className="text-xs text-slate-400 mt-1">
                  سجل حركة جديدة للشركاء أو أصدر سلفة أو جهز تصفية جولة تجارية بنقرة زر.
                </p>
              </div>
              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={() => setActiveTab('partners')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition"
                >
                  كشف حساب شريك
                </button>
                <button
                  onClick={() => setActiveTab('advances')}
                  className="px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-semibold transition"
                >
                  صرف سلفة
                </button>
                <button
                  onClick={() => setActiveTab('rounds')}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition"
                >
                  إدارة الجولات والأسهم
                </button>
              </div>
            </div>

            {/* Recent Rounds Preview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-200">الجولات الاستثمارية النشطة</h3>
                <button
                  onClick={() => setActiveTab('rounds')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  عرض جميع الجولات ←
                </button>
              </div>
              <RoundList
                state={state}
                onAddRound={handleAddRound}
                onAllocateShares={handleAllocateShares}
                onOpenLiquidation={(round) => setActiveLiquidationRound(round)}
              />
            </div>
          </div>
        )}

        {activeTab === 'partners' && (
          <PartnerList state={state} onAddPartner={handleAddPartner} />
        )}

        {activeTab === 'rounds' && (
          <RoundList
            state={state}
            onAddRound={handleAddRound}
            onAllocateShares={handleAllocateShares}
            onOpenLiquidation={(round) => setActiveLiquidationRound(round)}
          />
        )}

        {activeTab === 'advances' && (
          <AdvancesList
            state={state}
            onAddAdvance={handleAddAdvance}
            onSettleAdvance={handleSettleAdvance}
          />
        )}

        {activeTab === 'liquidations' && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-100 text-base">سجل التصفيات والمقاصة</h3>
                <p className="text-xs text-slate-400 mt-1">
                  تصفية الجولات، استرداد رأس المال، اقتطاع حصة المضارب، وخصم السلف والمسحوبات تلقائياً.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('rounds')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-xl transition"
              >
                تصفية جولة نشطة الآن
              </button>
            </div>

            <div className="border border-slate-800 rounded-2xl bg-slate-900/30 overflow-hidden">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">تاريخ التصفية</th>
                    <th className="p-3.5">الجولة التجارية</th>
                    <th className="p-3.5">رأس المال الابتدائي</th>
                    <th className="p-3.5">القيمة المحققة</th>
                    <th className="p-3.5">صافي الربح/الخسارة</th>
                    <th className="p-3.5">أرباح المضارب</th>
                    <th className="p-3.5">أرباح الشركاء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {state.liquidations.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500">
                        لا توجد تصفيات مكتملة حتى الآن
                      </td>
                    </tr>
                  ) : (
                    state.liquidations.map((l) => {
                      const round = state.rounds.find((r) => r.id === l.roundId)
                      return (
                        <tr key={l.id} className="hover:bg-slate-800/40 transition">
                          <td className="p-3.5 text-slate-400">{l.liquidationDate}</td>
                          <td className="p-3.5 font-semibold text-slate-200">
                            {round?.title || l.roundId}
                          </td>
                          <td className="p-3.5 text-slate-300">${l.initialCapital.toLocaleString()}</td>
                          <td className="p-3.5 font-bold text-slate-100">${l.finalAssetValue.toLocaleString()}</td>
                          <td className="p-3.5 font-bold text-emerald-400">+${l.grossProfitOrLoss.toLocaleString()}</td>
                          <td className="p-3.5 font-bold text-indigo-400">+${l.managerProfit.toLocaleString()}</td>
                          <td className="p-3.5 font-bold text-cyan-400">+${l.investorsProfitPool.toLocaleString()}</td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Global Liquidation Modal */}
      <LiquidationWizard
        round={activeLiquidationRound}
        state={state}
        onClose={() => setActiveLiquidationRound(null)}
        onCommitLiquidation={(updatedState) => setState(updatedState)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 text-center text-xs text-slate-500 print:hidden">
        نظام المضاربة والشراكات التجارية • تم البناء بواسطة React 19 + TypeScript + Tailwind CSS v4
      </footer>
    </div>
  )
}
