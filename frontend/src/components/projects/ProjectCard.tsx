import { Briefcase, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import type { Project, CashflowItem } from '../../types/accounting'

interface Props {
  project: Project
  cashflows: CashflowItem[]
  onSelectProject: (id: string) => void
}

export function ProjectCard({ project, cashflows, onSelectProject }: Props) {
  const pCash = cashflows.filter((c) => c.projectId === project.id)
  const inflow = pCash.filter((c) => c.type === 'inflow').reduce((s, c) => s + c.amount, 0)
  const outflow = pCash.filter((c) => c.type === 'outflow').reduce((s, c) => s + c.amount, 0)
  const net = inflow - outflow

  return (
    <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-100 text-sm">{project.name}</h3>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">{project.code}</span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {project.status === 'active' ? 'نشط' : 'مكتمل'}
          </span>
        </div>

        {project.description && (
          <p className="mt-2 text-xs text-slate-400 line-clamp-2">{project.description}</p>
        )}

        <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center text-xs">
          <div>
            <span className="text-slate-400 block text-[10px]">الوارد (المبيعات)</span>
            <span className="font-bold text-emerald-400 flex items-center justify-center gap-0.5 mt-0.5">
              <ArrowUpRight className="w-3 h-3" />${inflow.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">الصادر (المصروفات)</span>
            <span className="font-bold text-rose-400 flex items-center justify-center gap-0.5 mt-0.5">
              <ArrowDownRight className="w-3 h-3" />${outflow.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">صافي الرصيد</span>
            <span className={`font-bold mt-0.5 block ${net >= 0 ? 'text-cyan-400' : 'text-amber-400'}`}>
              ${net.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={() => onSelectProject(project.id)}
        className="mt-4 w-full py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition"
      >
        عرض قيود وسجلات المشروع
      </button>
    </div>
  )
}
