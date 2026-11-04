import { useState, useEffect, useCallback } from 'react'
import type { Partner } from '../../types'
import type { PartnerGlobalStats } from '../../types/partner'
import { apiClient } from '../../services/apiClient'
import { PartnerStatsCards } from './PartnerStatsCards'
import { PartnerCard } from './PartnerCard'
import { PartnerModal } from './PartnerModal'
import { PartnerStatementModal } from './PartnerStatementModal'
import { NewAdvanceModal } from './NewAdvanceModal'
import { Plus, Users } from 'lucide-react'

export function PartnerList() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [stats, setStats] = useState<PartnerGlobalStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null)
  const [stmtPartner, setStmtPartner] = useState<Partner | null>(null)
  const [advPartner, setAdvPartner] = useState<Partner | null>(null)

  const fetchPartners = useCallback(async () => {
    setLoading(true)
    try {
      const [list, s] = await Promise.all([
        apiClient.get<Partner[]>('/api/partners'),
        apiClient.get<PartnerGlobalStats>('/api/partners/stats')
      ])
      setPartners(list || []); setStats(s)
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchPartners() }, [fetchPartners])

  const handleDelete = async (id: string) => {
    await apiClient.delete(`/api/partners/${id}`)
    await fetchPartners()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-slate-900/60 p-4 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600/10 text-indigo-400 rounded-xl"><Users className="w-5 h-5" /></div>
          <div>
            <h2 className="text-base font-bold text-white">إدارة الشركاء والمساهمين</h2>
            <p className="text-xs text-slate-400">متابعة حسابات الشركاء، الأسهم، رؤوس الأموال، والسلف الفردية</p>
          </div>
        </div>
        <button onClick={() => { setEditingPartner(null); setIsModalOpen(true) }} className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md transition">
          <Plus className="w-3.5 h-3.5" /> شريك جديد
        </button>
      </div>

      <PartnerStatsCards stats={stats} />

      {loading ? <div className="text-center py-10 text-xs text-slate-500">جاري تحميل الشركاء...</div> : partners?.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/30 border border-dashed border-slate-800 rounded-2xl">
          <p className="text-slate-400 text-xs">لا يوجد شركاء مسجلين حالياً</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {partners?.map((partner) => (
            <PartnerCard
              key={partner.id}
              partner={partner}
              onViewStatement={(p) => setStmtPartner(p)}
              onIssueAdvance={(p) => setAdvPartner(p)}
              onEdit={(p) => { setEditingPartner(p); setIsModalOpen(true) }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <PartnerModal isOpen={isModalOpen} partner={editingPartner} onClose={() => { setIsModalOpen(false); setEditingPartner(null) }} onSaved={fetchPartners} />
      <PartnerStatementModal partner={stmtPartner} onClose={() => setStmtPartner(null)} />
      <NewAdvanceModal partner={advPartner} onClose={() => setAdvPartner(null)} onCreated={fetchPartners} />
    </div>
  )
}
