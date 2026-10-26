import { LayoutDashboard, Users, Briefcase, HandCoins, Calculator } from 'lucide-react'
import type { AppState } from '../../types/mudharaba'

export type TabType = 'dashboard' | 'partners' | 'rounds' | 'advances' | 'liquidations'

interface Props {
  activeTab: TabType
  onSelectTab: (tab: TabType) => void
  state: AppState
}

export function AppNavigation({ activeTab, onSelectTab, state }: Props) {
  const tabs = [
    { id: 'dashboard' as const, label: 'لوحة المتابعة', icon: LayoutDashboard },
    { id: 'partners' as const, label: `الشركاء (${state.partners.length})`, icon: Users },
    { id: 'rounds' as const, label: `الجولات (${state.rounds.length})`, icon: Briefcase },
    { id: 'advances' as const, label: `السلف (${state.advances.filter((a) => a.status === 'open').length})`, icon: HandCoins },
    { id: 'liquidations' as const, label: `التصفية (${state.liquidations.length})`, icon: Calculator }
  ]

  return (
    <nav className="border-b border-slate-800/60 bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex overflow-x-auto gap-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition shrink-0 ${
                isActive ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
