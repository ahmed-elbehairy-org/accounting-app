import { useState } from 'react'
import { FolderPlus, Search } from 'lucide-react'
import type { Project, CashflowItem } from '../../types/accounting'
import { ProjectCard } from './ProjectCard'
import { NewProjectModal } from './NewProjectModal'

interface Props {
  projects: Project[]
  cashflows: CashflowItem[]
  onAddProject: (p: Omit<Project, 'id' | 'createdAt'>) => void
  onSelectProject: (projectId: string) => void
}

export function ProjectList({ projects, cashflows, onAddProject, onSelectProject }: Props) {
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase())
  )

  const totalInflow = cashflows.filter((c) => c.type === 'inflow').reduce((s, c) => s + c.amount, 0)
  const totalOutflow = cashflows.filter((c) => c.type === 'outflow').reduce((s, c) => s + c.amount, 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
          <span className="text-xs text-slate-400">إجمالي المشاريع</span>
          <div className="mt-1 text-2xl font-bold text-white">{projects.length} مشروع</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
          <span className="text-xs text-slate-400">إجمالي إيرادات المشاريع (الوارد)</span>
          <div className="mt-1 text-2xl font-bold text-emerald-400">${totalInflow.toLocaleString()}</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
          <span className="text-xs text-slate-400">إجمالي مصاريف المشاريع (الصادر)</span>
          <div className="mt-1 text-2xl font-bold text-rose-400">${totalOutflow.toLocaleString()}</div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text" placeholder="بحث باسم المشروع أو الكود..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-9 pl-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition shadow-lg shadow-indigo-600/25 shrink-0"
        >
          <FolderPlus className="w-4 h-4" />
          <span>إضافة مشروع جديد</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-500 bg-slate-900/20 border border-slate-800 rounded-2xl">
            لا توجد مشاريع مسجلة حالياً
          </div>
        ) : (
          filtered.map((proj) => (
            <ProjectCard key={proj.id} project={proj} cashflows={cashflows} onSelectProject={onSelectProject} />
          ))
        )}
      </div>

      <NewProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={onAddProject} />
    </div>
  )
}
