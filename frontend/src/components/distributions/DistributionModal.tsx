import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '../../services/apiClient'
import type { Project } from '../../types'
import type { DistributionPreview } from '../../types/distributions'
import { DistributionSummary } from './DistributionSummary'
import { DistributionPayoutsTable } from './DistributionPayoutsTable'
import { X } from 'lucide-react'

interface Props {
  isOpen: boolean
  projects: Project[]
  defaultProjectId?: string
  onClose: () => void
  onCreated: () => void
}

export function DistributionModal({ isOpen, projects, defaultProjectId, onClose, onCreated }: Props) {
  const [projectId, setProjectId] = useState(defaultProjectId || (projects[0]?.id ?? ''))
  const [totalProfit, setTotalProfit] = useState(50000)
  const [distributedAmount, setDistributedAmount] = useState(40000)
  const [preview, setPreview] = useState<DistributionPreview | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPreview = useCallback(async () => {
    if (!projectId) return
    try {
      const res = await apiClient.post<DistributionPreview>('/api/distributions/preview', {
        projectId, totalProfit, distributedAmount
      })
      setPreview(res)
    } catch { setPreview(null) }
  }, [projectId, totalProfit, distributedAmount])

  useEffect(() => { if (isOpen) fetchPreview() }, [isOpen, fetchPreview])

  if (!isOpen) return null

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await apiClient.post('/api/distributions', { projectId, totalProfit, distributedAmount })
      onCreated()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل إنشاء جولة التوزيع')
    } finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" dir="rtl">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-2 border-b border-slate-800">
          <h2 className="text-base font-bold text-white">جولة توزيع أرباح جديدة (معاينة حية)</h2>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        {error && <div className="p-2 text-xs text-rose-400 bg-rose-500/10 rounded-lg">{error}</div>}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">المشروع</label>
              <select value={projectId} onChange={(e) => setProjectId(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white">
                {projects?.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">إجمالي الأرباح</label>
              <input type="number" min="1" value={totalProfit} onChange={(e) => setTotalProfit(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">المبلغ الموزع</label>
              <input type="number" min="1" max={totalProfit} value={distributedAmount} onChange={(e) => setDistributedAmount(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
            </div>
          </div>
          {preview && (
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <DistributionSummary totalProfit={preview.totalProfit} distributedAmount={preview.distributedAmount} retainedAmount={preview.retainedAmount} workerCut={preview.workerCut} investorPool={preview.investorPool} />
              <DistributionPayoutsTable payouts={preview.payouts} />
            </div>
          )}
          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={loading || !preview} className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold">{loading ? 'جاري الحفظ...' : 'حفظ كمسودة للتوزيع'}</button>
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs">إلغاء</button>
          </div>
        </form>
      </div>
    </div>
  )
}
