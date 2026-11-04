import { LayoutDashboard, Users, ArrowLeftRight, PieChart, ShieldAlert, Trash2 } from 'lucide-react'

export type TabType = 'projects' | 'partners' | 'cashflow' | 'distributions' | 'liquidations' | 'trash'

interface Props {
  activeTab: TabType
  onSelectTab: (tab: TabType) => void
  deletedCount: number
}

export function AppNavigation({ activeTab, onSelectTab, deletedCount }: Props) {
  const tabs = [
    { id: 'projects' as const, label: 'مشاريع المضاربة', icon: LayoutDashboard },
    { id: 'partners' as const, label: 'إدارة الشركاء', icon: Users },
    { id: 'cashflow' as const, label: 'الصادر والوارد', icon: ArrowLeftRight },
    { id: 'distributions' as const, label: 'توزيع الأرباح', icon: PieChart },
    { id: 'liquidations' as const, label: 'التصفية النهائية', icon: ShieldAlert },
    { id: 'trash' as const, label: `سلة المحذوفات (${deletedCount})`, icon: Trash2 }
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
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition shrink-0 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
