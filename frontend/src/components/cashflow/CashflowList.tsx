import { useState, useEffect, useCallback } from 'react'
import type { Project, CashflowItem, CashflowSummary } from '../../types'
import { apiClient } from '../../services/apiClient'
import { CashflowStatsCards } from './CashflowStatsCards'
import { CashflowTable } from './CashflowTable'
import { NewCashflowModal } from './NewCashflowModal'
import { Plus, ArrowLeftRight, Filter } from 'lucide-react'

interface Props {
  projects: Project[]
  onRefreshParent?: () => void
}

export function CashflowList({ projects }: Props) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('')
  const [items, setItems] = useState<CashflowItem[]>([])
  const [summary, setSummary] = useState<CashflowSummary | null>(null)
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchCashflow = useCallback(async () => {
    setLoading(true)
    try {
      const q = selectedProjectId ? `?projectId=${selectedProjectId}` : ''
      const [list, sum] = await Promise.all([
        apiClient.get<CashflowItem[]>(`/api/cashflow${q}`),
        apiClient.get<CashflowSummary>(`/api/cashflow/summary${q}`)
      ])
      setItems(list || [])
      setSummary(sum)
    } finally {
      setLoading(false)
    }
  }, [selectedProjectId])

  useEffect(() => {
    fetchCashflow()
  }, [fetchCashflow])

  const handleDelete = async (id: string) => {
    await apiClient.delete(`/api/cashflow/${id}`)
    await fetchCashflow()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/60 p-4 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600/10 text-indigo-400 rounded-xl">
            <ArrowLeftRight className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">دفتر الأستاذ (الصادر والوارد)</h2>
            <p className="text-xs text-slate-400">تتبع الإيرادات والمصروفات وحساب الأرباح تلقائياً</p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="bg-transparent text-slate-200 outline-none"
            >
              <option value="">كل المشاريع</option>
              {projects?.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
            </select>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md transition"
          >
            <Plus className="w-3.5 h-3.5" />
            قيد جديد
          </button>
        </div>
      </div>

      <CashflowStatsCards summary={summary} />

      <CashflowTable items={items} loading={loading} onDelete={handleDelete} />

      <NewCashflowModal
        isOpen={isModalOpen}
        projects={projects}
        defaultProjectId={selectedProjectId}
        onClose={() => setIsModalOpen(false)}
        onCreated={fetchCashflow}
      />
    </div>
  )
}

