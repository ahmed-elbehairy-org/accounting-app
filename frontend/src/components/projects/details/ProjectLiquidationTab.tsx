import { useState, useEffect, useCallback } from 'react'
import type { Project, Liquidation, SettlementPayout } from '../../../types'
import { apiClient } from '../../../services/apiClient'
import { LiquidationWizardModal } from '../../liquidation/LiquidationWizardModal'
import { LiquidationPreviewCards } from '../../liquidation/LiquidationPreviewCards'
import { LiquidationSettlementTable } from '../../liquidation/LiquidationSettlementTable'
import { DeleteButton } from '../../common/DeleteButton'
import { Plus } from 'lucide-react'

interface Props {
  project: Project
  onProjectUpdated: () => void
}

export function ProjectLiquidationTab({ project, onProjectUpdated }: Props) {
  const [liquidations, setLiquidations] = useState<Liquidation[]>([])
  const [payoutsMap, setPayoutsMap] = useState<Record<string, SettlementPayout[]>>({})
  const [isWizardOpen, setIsWizardOpen] = useState(false)

  const fetchLiquidations = useCallback(async () => {
    const list = await apiClient.get<Liquidation[]>(`/api/liquidations?projectId=${project.id}`)
    setLiquidations(list || [])
    for (const liq of list || []) {
      apiClient.get<SettlementPayout[]>(`/api/liquidations/${liq.id}/payouts`).then((p) => {
        setPayoutsMap((prev) => ({ ...prev, [liq.id]: p || [] }))
      })
    }
  }, [project.id])

  useEffect(() => { fetchLiquidations() }, [fetchLiquidations])

  const handleDelete = async (id: string) => {
    await apiClient.delete(`/api/liquidations/${id}`)
    await fetchLiquidations()
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-slate-900/40 p-3 rounded-xl border border-slate-800">
        <span className="text-xs text-slate-300">سجل وحالة التصفية النهائية للمشروع</span>
        {project.status !== 'liquidated' && (
          <button
            onClick={() => setIsWizardOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-md transition"
          >
            <Plus className="w-3.5 h-3.5" />
            بدء تصفية نهائية
          </button>
        )}
      </div>

      {liquidations.length === 0 ? (
        <div className="p-12 text-center text-slate-500 bg-slate-900/20 border border-slate-800 rounded-2xl text-xs">
          المشروع نشط ولم تتم تصفيته بعد
        </div>
      ) : (
        liquidations.map((liq) => {
          const calc = {
            initialCapital: Number(project.totalAllocatedShares || 0) * Number(project.shareUnitPrice || 1000),
            finalAssetValue: Number(liq.finalAssetValue || 0),
            grossProfitOrLoss: Number(liq.grossProfitOrLoss || 0),
            workerProfit: Number(liq.workerProfit || 0),
            investorsProfitPool: Number(liq.investorsProfitPool || 0),
            returnPerShare: Number(liq.returnPerShare || 0),
            payouts: []
          }
          return (
            <div key={liq.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-slate-200">تصفية بتاريخ {liq.liquidationDate}</span>
                <DeleteButton onDelete={() => handleDelete(liq.id)} />
              </div>
              <LiquidationPreviewCards calculation={calc} />
              <LiquidationSettlementTable payouts={payoutsMap[liq.id] || []} />
            </div>
          )
        })
      )}

      <LiquidationWizardModal
        isOpen={isWizardOpen}
        projects={[project]}
        onClose={() => setIsWizardOpen(false)}
        onExecuted={() => { fetchLiquidations(); onProjectUpdated() }}
      />
    </div>
  )
}
