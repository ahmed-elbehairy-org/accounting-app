import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '../../services/apiClient'
import type { Project } from '../../types'
import type { LiquidationPreviewResponse } from '../../types/liquidation'
import { LiquidationPreviewCards } from './LiquidationPreviewCards'
import { LiquidationSettlementTable } from './LiquidationSettlementTable'
import { X, AlertTriangle } from 'lucide-react'

interface Props {
  isOpen: boolean
  projects: Project[]
  onClose: () => void
  onExecuted: () => void
}

export function LiquidationWizardModal({ isOpen, projects, onClose, onExecuted }: Props) {
  const activeProjects = projects.filter((p) => p.status === 'active')
  const [projectId, setProjectId] = useState(activeProjects[0]?.id || '')
  const [finalAssetValue, setFinalAssetValue] = useState<number>(60000)
  const [notes, setNotes] = useState('')
  const [preview, setPreview] = useState<LiquidationPreviewResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPreview = useCallback(async () => {
    if (!projectId) return
    try {
      const res = await apiClient.post<LiquidationPreviewResponse>('/api/liquidations/preview', {
        projectId, finalAssetValue: Number(finalAssetValue)
      })
      setPreview(res)
    } catch { setPreview(null) }
  }, [projectId, finalAssetValue])

  useEffect(() => { if (isOpen) fetchPreview() }, [isOpen, fetchPreview])

  if (!isOpen) return null

  const handleExecute = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await apiClient.post('/api/liquidations/execute', {
        projectId, finalAssetValue: Number(finalAssetValue), notes
      })
      onExecuted()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل تنفيذ التصفية')
    } finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" dir="rtl">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2 text-rose-400">
            <AlertTriangle className="w-5 h-5" />
            <h2 className="text-base font-bold text-white">معالج التصفية النهائية للمشروع</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        {error && <div className="p-2 text-xs text-rose-400 bg-rose-500/10 rounded-lg">{error}</div>}
        <form onSubmit={handleExecute} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select value={projectId} onChange={(e) => setProjectId(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white">
              {activeProjects?.map((p) => (<option key={p.id} value={p.id}>{p.name} ({p.code})</option>))}
            </select>
            <input type="number" min="0" placeholder="قيمة التصفية" value={finalAssetValue} onChange={(e) => setFinalAssetValue(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
          </div>
          <input value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" placeholder="ملاحظات ختامية للتصفية..." />
          {preview && (
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <LiquidationPreviewCards calculation={preview.calculation} />
              <LiquidationSettlementTable payouts={preview.calculation.payouts} />
            </div>
          )}
          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={loading || !preview} className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold">
              {loading ? 'جاري تنفيذ التصفية...' : 'تأكيد التصفية النهائية وإغلاق المشروع'}
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs">إلغاء</button>
          </div>
        </form>
      </div>
    </div>
  )
}
