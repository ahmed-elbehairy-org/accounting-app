import { useState } from 'react'
import type { TradingRound } from './types/mudharaba'
import { useMudharabaState } from './hooks/useMudharabaState'
import { AppHeader } from './components/layout/AppHeader'
import { AppNavigation, type TabType } from './components/layout/AppNavigation'

import { DashboardTab } from './components/dashboard/DashboardTab'
import { PartnerList } from './components/partners/PartnerList'
import { RoundList } from './components/rounds/RoundList'
import { AdvancesList } from './components/advances/AdvancesList'
import { LiquidationHistoryTab } from './components/liquidation/LiquidationHistoryTab'
import { LiquidationWizard } from './components/liquidation/LiquidationWizard'
import { ProjectList } from './components/projects/ProjectList'
import { CashflowList } from './components/cashflow/CashflowList'
import { ProductCostingList } from './components/costing/ProductCostingList'

export default function App() {
  const {
    state, setState, addPartner, addRound, allocateShares, addAdvance,
    settleAdvance, addProject, addCashflow, addProduct, addCostItem, resetAllData
  } = useMudharabaState()
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>()
  const [activeLiquidationRound, setActiveLiquidationRound] = useState<TradingRound | null>(null)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white" dir="rtl">
      <AppHeader onReset={resetAllData} />
      <AppNavigation activeTab={activeTab} onSelectTab={(t) => setActiveTab(t)} state={state} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
        {activeTab === 'dashboard' && (
          <DashboardTab
            state={state} onSelectTab={(t) => setActiveTab(t)}
            onAddRound={addRound} onAllocateShares={allocateShares}
            onOpenLiquidation={(r) => setActiveLiquidationRound(r)}
          />
        )}
        {activeTab === 'projects' && (
          <ProjectList
            projects={state.projects} cashflows={state.cashflows}
            onAddProject={addProject}
            onSelectProject={(id) => { setSelectedProjectId(id); setActiveTab('cashflow') }}
          />
        )}
        {activeTab === 'cashflow' && (
          <CashflowList
            cashflows={state.cashflows} projects={state.projects}
            selectedProjectId={selectedProjectId} onAddCashflow={addCashflow}
          />
        )}
        {activeTab === 'costing' && (
          <ProductCostingList
            products={state.products} costItems={state.costItems}
            projects={state.projects} cashflows={state.cashflows}
            onAddProduct={addProduct} onAddCostItem={addCostItem}
          />
        )}
        {activeTab === 'partners' && <PartnerList state={state} onAddPartner={addPartner} />}
        {activeTab === 'rounds' && (
          <RoundList
            state={state} onAddRound={addRound} onAllocateShares={allocateShares}
            onOpenLiquidation={(r) => setActiveLiquidationRound(r)}
          />
        )}
        {activeTab === 'advances' && <AdvancesList state={state} onAddAdvance={addAdvance} onSettleAdvance={settleAdvance} />}
        {activeTab === 'liquidations' && <LiquidationHistoryTab state={state} onGoToRounds={() => setActiveTab('rounds')} />}
      </main>

      <LiquidationWizard
        round={activeLiquidationRound} state={state}
        onClose={() => setActiveLiquidationRound(null)} onCommitLiquidation={(u) => setState(u)}
      />

      <footer className="border-t border-slate-800/80 py-4 text-center text-xs text-slate-500 print:hidden">
        نظام محاسبة المشاريع والصادر والوارد وتكلفة المنتجات • React 19 + TypeScript + NestJS + PostgreSQL
      </footer>
    </div>
  )
}
