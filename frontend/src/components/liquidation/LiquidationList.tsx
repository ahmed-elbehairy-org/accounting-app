import { useState, useEffect, useCallback } from 'react'
import type { Project, Liquidation, SettlementPayout } from '../../types'
import { apiClient } from '../../services/apiClient'
import { LiquidationWizardModal } from './LiquidationWizardModal'
import { LiquidationPreviewCards } from './LiquidationPreviewCards'
import { LiquidationSettlementTable } from './LiquidationSettlementTable'
import { DeleteButton } from '../common/DeleteButton'
import { ShieldAlert, Plus } from 'lucide-react'

interface Props {
  projects: Project[]
  onRefreshParent?: () => void
}

export function LiquidationList({ projects, onRefreshParent }: Props) {
  const [liquidations, setLiquidations] = useState<Liquidation[]>([])
  const [payoutsMap, setPayoutsMap] = useState<Record<string, SettlementPayout[]>>({})
  const [loading, setLoading] = useState(false)
  const [isWizardOpen, setIsWizardOpen] = useState(false)

  const fetchLiquidations = useCallback(async () => {
    setLoading(true)
    try {
      const list = await apiClient.get<Liquidation[]>('/api/liquidations')
      setLiquidations(list || [])
      for (const liq of list || []) {
        apiClient.get<SettlementPayout[]>(`/api/liquidations/${liq.id}/payouts`).then((p) => {
          setPayoutsMap((prev) => ({ ...prev, [liq.id]: p || [] }))
        })
      }
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchLiquidations() }, [fetchLiquidations])

  const handleDelete = async (id: string) => {
    await apiClient.delete(`/api/liquidations/${id}`)
    await fetchLiquidations()
  }

  const handleExecuted = () => {
    fetchLiquidations()
    if (onRefreshParent) onRefreshParent()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-slate-900/60 p-4 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-600/10 text-rose-400 rounded-xl"><ShieldAlert className="w-5 h-5" /></div>
          <div>
            <h2 className="text-base font-bold text-white">جولات التصفية النهائية وإغلاق المشاريع</h2>
            <p className="text-xs text-slate-400">حساب الأصول، استرداد رأس المال، عزل أرباح المضارب، وتوزيع المستحقات</p>
          </div>
        </div>
        <button onClick={() => setIsWizardOpen(true)} className="flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-md transition">
          <Plus className="w-3.5 h-3.5" />
          تصفية مشروع
        </button>
      </div>

      {loading ? <div className="text-center py-10 text-xs text-slate-500">جاري التحميل...</div> : liquidations?.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/30 border border-dashed border-slate-800 rounded-2xl">
          <p className="text-slate-400 text-xs">لا توجد مشاريع مصفاة حالياً</p>
        </div>
      ) : (
        <div className="space-y-4">
          {liquidations?.map((liq) => (
            <div key={liq.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-rose-500/10 text-rose-400 border border-rose-500/20">مشروع مصفى</span>
                  <span className="text-xs text-slate-400 font-mono">{liq.liquidationDate}</span>
                </div>
                <DeleteButton onDelete={() => handleDelete(liq.id)} />
              </div>
              <LiquidationPreviewCards calculation={{
                initialCapital: Number(liq.initialCapital), finalAssetValue: Number(liq.finalAssetValue),
                grossProfitOrLoss: Number(liq.grossProfitOrLoss), workerProfit: Number(liq.workerProfit),
                investorsProfitPool: Number(liq.investorsProfitPool), returnPerShare: Number(liq.returnPerShare), payouts: []
              }} />
              {payoutsMap[liq.id] && <LiquidationSettlementTable payouts={payoutsMap[liq.id]} />}
            </div>
          ))}
        </div>
      )}
      <LiquidationWizardModal isOpen={isWizardOpen} projects={projects} onClose={() => setIsWizardOpen(false)} onExecuted={handleExecuted} />
    </div>
  )
}

