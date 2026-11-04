import { useState, useEffect, useCallback } from 'react'
import type { Project } from '../../../types'
import type { ProfitDistribution, PartnerPayout } from '../../../types/distributions'
import { apiClient } from '../../../services/apiClient'
import { DistributionModal } from '../../distributions/DistributionModal'
import { DistributionCard } from '../../distributions/DistributionCard'
import { Plus } from 'lucide-react'

interface Props {
  project: Project
}

export function ProjectDistributionsTab({ project }: Props) {
  const [distributions, setDistributions] = useState<ProfitDistribution[]>([])
  const [payoutsMap, setPayoutsMap] = useState<Record<string, PartnerPayout[]>>({})
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchDistributions = useCallback(async () => {
    const list = await apiClient.get<ProfitDistribution[]>(`/api/distributions?projectId=${project.id}`)
    setDistributions(list || [])
    for (const d of list || []) {
      apiClient.get<PartnerPayout[]>(`/api/distributions/${d.id}/payouts`).then((p) => {
        setPayoutsMap((prev) => ({ ...prev, [d.id]: p || [] }))
      })
    }
  }, [project.id])

  useEffect(() => { fetchDistributions() }, [fetchDistributions])

  const handleApprove = async (id: string) => {
    await apiClient.post(`/api/distributions/${id}/approve`, {})
    await fetchDistributions()
  }

  const handleDelete = async (id: string) => {
    await apiClient.delete(`/api/distributions/${id}`)
    await fetchDistributions()
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-slate-900/40 p-3 rounded-xl border border-slate-800">
        <span className="text-xs text-slate-300">جولات توزيع الأرباح الخاصة بالمشروع</span>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md transition"
        >
          <Plus className="w-3.5 h-3.5" />
          توزيع أرباح جديد
        </button>
      </div>

      {distributions.length === 0 ? (
        <div className="p-12 text-center text-slate-500 bg-slate-900/20 border border-slate-800 rounded-2xl text-xs">
          لا توجد دورات توزيع أرباح لهذا المشروع حتى الآن
        </div>
      ) : (
        <div className="space-y-4">
          {distributions.map((dist) => (
            <DistributionCard
              key={dist.id}
              distribution={dist}
              payouts={payoutsMap[dist.id] || []}
              onApprove={handleApprove}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <DistributionModal
        isOpen={isModalOpen}
        projects={[project]}
        defaultProjectId={project.id}
        onClose={() => setIsModalOpen(false)}
        onCreated={fetchDistributions}
      />
    </div>
  )
}
