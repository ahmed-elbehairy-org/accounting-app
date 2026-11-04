import { ArrowRight, FolderKanban, Users, ArrowLeftRight, PieChart, ShieldAlert } from 'lucide-react'
import type { Project } from '../../../types'

export type ProjectSubTab = 'partners' | 'cashflow' | 'distributions' | 'liquidation'

interface Props {
  project: Project
  activeSubTab: ProjectSubTab
  onSelectSubTab: (tab: ProjectSubTab) => void
  onBack: () => void
}

export function ProjectHeaderNav({ project, activeSubTab, onSelectSubTab, onBack }: Props) {
  const tabs = [
    { id: 'partners' as const, label: 'الشركاء والاكتتاب', icon: Users },
    { id: 'cashflow' as const, label: 'الصادر والوارد', icon: ArrowLeftRight },
    { id: 'distributions' as const, label: 'توزيع الأرباح', icon: PieChart },
    { id: 'liquidation' as const, label: 'التصفية النهائية', icon: ShieldAlert }
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-slate-900/60 p-4 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
            title="العودة لكل المشاريع"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <div className="p-2.5 bg-indigo-600/10 text-indigo-400 rounded-xl">
            <FolderKanban className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">{project.name}</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                {project.code}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${project.status === 'liquidated' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'}`}>
                {project.status === 'liquidated' ? 'تمت التصفية' : 'نشط'}
              </span>
            </div>
            <p className="text-xs text-slate-400">العامل: {project.workerName || 'غير محدد'} | نسبة العامل: {project.workerProfitPercentage}%</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeSubTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onSelectSubTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition ${
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
    </div>
  )
}
