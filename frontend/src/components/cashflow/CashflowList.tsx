import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import type { CashflowItem, Project } from '../../types/accounting'
import { CashflowTable } from './CashflowTable'
import { NewCashflowModal } from './NewCashflowModal'

interface Props {
  cashflows: CashflowItem[]
  projects: Project[]
  selectedProjectId?: string
  onAddCashflow: (c: Omit<CashflowItem, 'id'>) => void
}

export function CashflowList({ cashflows, projects, selectedProjectId, onAddCashflow }: Props) {
  const [filterProject, setFilterProject] = useState(selectedProjectId || '')
  const [filterType, setFilterType] = useState<'all' | 'inflow' | 'outflow'>('all')
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filtered = cashflows.filter((c) => {
    const matchesProj = !filterProject || c.projectId === filterProject
    const matchesType = filterType === 'all' || c.type === filterType
    const matchesSearch = (c.description || '').toLowerCase().includes(search.toLowerCase())
    return matchesProj && matchesType && matchesSearch
  })

  const inflow = filtered.filter((c) => c.type === 'inflow').reduce((s, c) => s + c.amount, 0)
  const outflow = filtered.filter((c) => c.type === 'outflow').reduce((s, c) => s + c.amount, 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
          <span className="text-xs text-slate-400">إجمالي الوارد (المقبوضات)</span>
          <div className="mt-1 text-2xl font-bold text-emerald-400">+${inflow.toLocaleString()}</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
          <span className="text-xs text-slate-400">إجمالي الصادر (المصروفات)</span>
          <div className="mt-1 text-2xl font-bold text-rose-400">-${outflow.toLocaleString()}</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
          <span className="text-xs text-slate-400">صافي التدفق المالي</span>
          <div className={`mt-1 text-2xl font-bold ${inflow - outflow >= 0 ? 'text-cyan-400' : 'text-amber-400'}`}>
            ${(inflow - outflow).toLocaleString()}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative flex-1 min-w-[160px] max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text" placeholder="بحث بالبيان..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pr-9 pl-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={filterProject} onChange={(e) => setFilterProject(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none"
          >
            <option value="">جميع المشاريع</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>

          <div className="flex bg-slate-900 p-1 border border-slate-800 rounded-xl text-xs">
            {(['all', 'inflow', 'outflow'] as const).map((t) => (
              <button
                key={t} onClick={() => setFilterType(t)}
                className={`px-3 py-1 rounded-lg transition font-medium ${filterType === t ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
              >
                {t === 'all' ? 'الكل' : t === 'inflow' ? 'الوارد' : 'الصادر'}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition shadow-lg shadow-indigo-600/25 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>تسجيل حركة مالية</span>
        </button>
      </div>

      <div className="border border-slate-800 rounded-2xl bg-slate-900/30 overflow-hidden">
        <CashflowTable items={filtered} projects={projects} />
      </div>

      <NewCashflowModal
        isOpen={isModalOpen} projects={projects} selectedProjectId={filterProject}
        onClose={() => setIsModalOpen(false)} onSave={onAddCashflow}
      />
    </div>
  )
}
