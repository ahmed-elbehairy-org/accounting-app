import { useState, useEffect } from 'react'
import { apiClient } from '../../services/apiClient'
import type { Project, Partner } from '../../types'
import { X } from 'lucide-react'

interface Props {
  project: Project | null
  onClose: () => void
  onAllocated: () => void
}

export function AllocateSharesModal({ project, onClose, onAllocated }: Props) {
  const [partners, setPartners] = useState<Partner[]>([])
  const [partnerId, setPartnerId] = useState('')
  const [shareCount, setShareCount] = useState(10)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (project) {
      apiClient.get<Partner[]>('/api/partners')
        .then((data) => {
          setPartners(data || [])
          if (data && data.length > 0) setPartnerId(data[0].id)
        })
        .catch(() => setError('فشل جلب قائمة الشركاء'))
    }
  }, [project])

  if (!project) return null

  const unitPrice = project.shareUnitPrice || 1000
  const totalAmount = shareCount * unitPrice
  const totalSharesAfter = (project.totalAllocatedShares || 0) + shareCount
  const poolPercent = totalSharesAfter > 0 ? (shareCount / totalSharesAfter) * 100 : 0
  const remCut = 100 - (project.workerProfitPercentage || 20)
  const effectiveProfitPercent = (remCut * poolPercent) / 100

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!partnerId) return setError('يرجى اختيار شريك')
    setLoading(true)
    setError(null)
    try {
      await apiClient.post(`/api/projects/${project.id}/allocate`, { partnerId, shareCount: Number(shareCount) })
      onAllocated()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل تخصيص الأسهم')
    } finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" dir="rtl">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-slate-800">
          <h2 className="text-base font-bold text-white">تخصيص أسهم: {project.name}</h2>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        {error && <div className="p-2 text-xs text-rose-400 bg-rose-500/10 rounded-lg">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-slate-400 block mb-1">الشريك المكتتب</label>
            <select value={partnerId} onChange={(e) => setPartnerId(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white">
              {partners.map((p) => (<option key={p.id} value={p.id}>{p.name} ({p.phone || 'بدون هاتف'})</option>))}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">عدد الأسهم</label>
            <input type="number" min="1" value={shareCount} onChange={(e) => setShareCount(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
          </div>
          <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-1 text-xs">
            <div className="flex justify-between text-slate-400"><span>المبلغ الإجمالي المطلوب:</span><span className="font-bold text-white">{totalAmount.toLocaleString()} ج</span></div>
            <div className="flex justify-between text-slate-400"><span>نسبته من وعاء المستثمرين:</span><span className="text-indigo-400 font-bold">{poolPercent.toFixed(1)}%</span></div>
            <div className="flex justify-between text-slate-400"><span>نسبة الربح الفعلية للمكتتب:</span><span className="text-emerald-400 font-bold">{effectiveProfitPercent.toFixed(2)}%</span></div>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={loading || !partnerId} className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold">{loading ? 'جاري التخصيص...' : 'تأكيد الاكتتاب'}</button>
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs">إلغاء</button>
          </div>
        </form>
      </div>
    </div>
  )
}
