import { useState, useEffect, useCallback } from 'react'
import type { Project, CashflowItem, CashflowSummary } from '../../../types'
import { apiClient } from '../../../services/apiClient'
import { CashflowStatsCards } from '../../cashflow/CashflowStatsCards'
import { CashflowTable } from '../../cashflow/CashflowTable'
import { NewCashflowModal } from '../../cashflow/NewCashflowModal'
import { Plus } from 'lucide-react'

interface Props {
  project: Project
}

export function ProjectCashflowTab({ project }: Props) {
  const [items, setItems] = useState<CashflowItem[]>([])
  const [summary, setSummary] = useState<CashflowSummary | null>(null)
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [list, sum] = await Promise.all([
        apiClient.get<CashflowItem[]>(`/api/cashflow?projectId=${project.id}`),
        apiClient.get<CashflowSummary>(`/api/cashflow/summary?projectId=${project.id}`)
      ])
      setItems(list || [])
      setSummary(sum)
    } finally { setLoading(false) }
  }, [project.id])

  useEffect(() => { fetchData() }, [fetchData])

  const handleDelete = async (id: string) => {
    await apiClient.delete(`/api/cashflow/${id}`)
    await fetchData()
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-slate-900/40 p-3 rounded-xl border border-slate-800">
        <span className="text-xs text-slate-300">سجل المعاملات النقدية الخاص بـ {project.name}</span>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md transition"
        >
          <Plus className="w-3.5 h-3.5" />
          حركة جديدة
        </button>
      </div>

      <CashflowStatsCards summary={summary} />
      <CashflowTable items={items} loading={loading} onDelete={handleDelete} />

      <NewCashflowModal
        isOpen={isModalOpen}
        projects={[project]}
        defaultProjectId={project.id}
        onClose={() => setIsModalOpen(false)}
        onCreated={fetchData}
      />
    </div>
  )
}

