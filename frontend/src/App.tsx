import { useState, useEffect, useCallback } from 'react'
import { AppNavigation, type TabType } from './components/layout/AppNavigation'
import { TrashTab, type DeletedRecord } from './components/trash/TrashTab'
import { ProjectList } from './components/projects/ProjectList'
import { CashflowList } from './components/cashflow/CashflowList'
import { DistributionList } from './components/distributions/DistributionList'
import { LiquidationList } from './components/liquidation/LiquidationList'
import { PartnerList } from './components/partners/PartnerList'
import { apiClient } from './services/apiClient'
import { buildTrashRecords } from './utils/trashRecords'
import type { Project, CashflowItem, Partner } from './types'

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('projects')
  const [projects, setProjects] = useState<Project[]>([])
  const [delProjects, setDelProjects] = useState<Project[]>([])
  const [delCashflows, setDelCashflows] = useState<CashflowItem[]>([])
  const [delPartners, setDelPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const [projs, pTrash, cfTrash, ptTrash] = await Promise.all([
        apiClient.get<Project[]>('/api/projects'),
        apiClient.get<Project[]>('/api/projects/trash'),
        apiClient.get<CashflowItem[]>('/api/cashflow/trash'),
        apiClient.get<Partner[]>('/api/partners/trash')
      ])
      setProjects(projs || []); setDelProjects(pTrash || [])
      setDelCashflows(cfTrash || []); setDelPartners(ptTrash || [])
    } catch (err) { setError(err instanceof Error ? err.message : 'فشل الاتصال بالخادم') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const handleSoftDelete = async (id: string) => {
    await apiClient.delete(`/api/projects/${id}`)
    await fetchData()
  }

  const handleRestore = async (cat: DeletedRecord['category'], id: string) => {
    const ep = cat === 'cashflows' ? 'cashflow' : cat
    await apiClient.patch(`/api/${ep}/${id}/restore`)
    await fetchData()
  }

  const handlePermanentDelete = async (cat: DeletedRecord['category'], id: string) => {
    const ep = cat === 'cashflows' ? 'cashflow' : cat
    await apiClient.delete(`/api/${ep}/${id}/permanent`)
    await fetchData()
  }

  const trashRecords = buildTrashRecords(delProjects, delCashflows, delPartners)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased" dir="rtl">
      <AppNavigation activeTab={activeTab} onSelectTab={setActiveTab} deletedCount={trashRecords.length} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-6">
        {error && <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl">{error}</div>}
        {activeTab === 'projects' && (
          <ProjectList projects={projects} loading={loading} onRefresh={fetchData} onDelete={handleSoftDelete} />
        )}
        {activeTab === 'partners' && <PartnerList />}
        {activeTab === 'cashflow' && <CashflowList projects={projects} />}
        {activeTab === 'distributions' && <DistributionList projects={projects} />}
        {activeTab === 'liquidations' && <LiquidationList projects={projects} onRefreshParent={fetchData} />}
        {activeTab === 'trash' && (
          <TrashTab items={trashRecords} onRestore={handleRestore} onPermanentDelete={handlePermanentDelete} />
        )}
      </main>
    </div>
  )
}
