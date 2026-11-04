import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '../../../services/apiClient'
import type { Project, Partner } from '../../../types'
import { UserPlus, Plus } from 'lucide-react'
import { AllocateSharesModal } from '../AllocateSharesModal'
import { PartnerModal } from '../../partners/PartnerModal'

interface ShareItem {
  id: string
  partnerId: string
  shareCount: number
  shareUnitPrice: number
  totalAmount: number
  date: string
}

interface Props {
  project: Project
  onRefreshProject: () => void
}

export function ProjectPartnersTab({ project, onRefreshProject }: Props) {
  const [investments, setInvestments] = useState<ShareItem[]>([])
  const [partnersMap, setPartnersMap] = useState<Record<string, string>>({})
  const [isAllocateOpen, setIsAllocateOpen] = useState(false)
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false)

  const loadData = useCallback(async () => {
    const [invs, parts] = await Promise.all([
      apiClient.get<ShareItem[]>(`/api/projects/${project.id}/investments`),
      apiClient.get<Partner[]>('/api/partners')
    ])
    setInvestments(invs || [])
    const map: Record<string, string> = {}
    ;(parts || []).forEach((p) => { map[p.id] = p.name })
    setPartnersMap(map)
  }, [project.id])

  useEffect(() => { loadData() }, [loadData])

  const totalCap = investments.reduce((s, i) => s + Number(i.totalAmount), 0)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-slate-900/40 p-3 rounded-xl border border-slate-800">
        <span className="text-xs text-slate-300">
          إجمالي الأسهم المكتتبة: <strong className="text-white">{project.totalAllocatedShares || 0}</strong> | رأس المال: <strong className="text-emerald-400">{totalCap.toLocaleString()} ج</strong>
        </span>
        <div className="flex gap-2">
          <button onClick={() => setIsPartnerModalOpen(true)} className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs transition">
            <Plus className="w-3.5 h-3.5" /> شريك جديد
          </button>
          <button onClick={() => setIsAllocateOpen(true)} className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md transition">
            <UserPlus className="w-3.5 h-3.5" /> تخصيص أسهم
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/30">
        <table className="w-full text-right text-xs">
          <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="p-3">الشريك</th>
              <th className="p-3">عدد الأسهم</th>
              <th className="p-3">سعر السهم</th>
              <th className="p-3">إجمالي الاستثمار</th>
              <th className="p-3">التاريخ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {investments.length === 0 ? (
              <tr><td colSpan={5} className="p-6 text-center text-slate-500">لا يوجد شركاء مكتتبون في هذا المشروع بعد</td></tr>
            ) : (
              investments.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-800/30">
                  <td className="p-3 font-medium text-slate-200">{partnersMap[inv.partnerId] || inv.partnerId}</td>
                  <td className="p-3 text-indigo-400 font-semibold">{inv.shareCount} سهم</td>
                  <td className="p-3 text-slate-300">{Number(inv.shareUnitPrice).toLocaleString()} ج</td>
                  <td className="p-3 text-emerald-400 font-semibold">{Number(inv.totalAmount).toLocaleString()} ج</td>
                  <td className="p-3 text-slate-400">{inv.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AllocateSharesModal project={isAllocateOpen ? project : null} onClose={() => setIsAllocateOpen(false)} onAllocated={() => { loadData(); onRefreshProject() }} />
      <PartnerModal isOpen={isPartnerModalOpen} onClose={() => setIsPartnerModalOpen(false)} onSaved={loadData} />
    </div>
  )
}

