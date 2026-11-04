import { useState, useEffect, useCallback } from 'react'
import type { Project } from '../../types'
import type { ProfitDistribution, PartnerPayout } from '../../types/distributions'
import { apiClient } from '../../services/apiClient'
import { DistributionModal } from './DistributionModal'
import { DistributionCard } from './DistributionCard'
import { Plus, PieChart } from 'lucide-react'

interface Props {
  projects: Project[]
}

export function DistributionList({ projects }: Props) {
  const [distributions, setDistributions] = useState<ProfitDistribution[]>([])
  const [payoutsMap, setPayoutsMap] = useState<Record<string, PartnerPayout[]>>({})
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchDistributions = useCallback(async () => {
    setLoading(true)
    try {
      const data = await apiClient.get<ProfitDistribution[]>('/api/distributions')
      setDistributions(data || [])
      for (const d of data || []) {
        apiClient.get<PartnerPayout[]>(`/api/distributions/${d.id}/payouts`).then((p) => {
          setPayoutsMap((prev) => ({ ...prev, [d.id]: p || [] }))
        })
      }
    } finally { setLoading(false) }
  }, [])

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
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-slate-900/60 p-4 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600/10 text-indigo-400 rounded-xl"><PieChart className="w-5 h-5" /></div>
          <div>
            <h2 className="text-base font-bold text-white">جولات توزيع الأرباح الشرعية</h2>
            <p className="text-xs text-slate-400">عزل حصة العامل وتوزيع عوائد المستثمرين وتسوية السلف</p>
          </div>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md transition">
          <Plus className="w-3.5 h-3.5" />
          توزيع أرباح
        </button>
      </div>

      {loading ? <div className="text-center py-10 text-xs text-slate-500">جاري التحميل...</div> : distributions?.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/30 border border-dashed border-slate-800 rounded-2xl">
          <p className="text-slate-400 text-xs">لا توجد جولات توزيع أرباح مسجلة</p>
        </div>
      ) : (
        <div className="space-y-4">
          {distributions?.map((d) => (
            <DistributionCard
              key={d.id}
              distribution={d}
              payouts={payoutsMap[d.id]}
              onApprove={handleApprove}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
      <DistributionModal isOpen={isModalOpen} projects={projects} onClose={() => setIsModalOpen(false)} onCreated={fetchDistributions} />
    </div>
  )
}
