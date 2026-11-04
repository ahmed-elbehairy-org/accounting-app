import { useState, useEffect } from 'react'
import { apiClient } from '../../services/apiClient'
import type { Project } from '../../types'
import { X } from 'lucide-react'

interface Props {
  isOpen: boolean
  project?: Project | null
  onClose: () => void
  onSaved: () => void
}

export function ProjectFormModal({ isOpen, project, onClose, onSaved }: Props) {
  const [name, setName] = useState('')
  const [workerName, setWorkerName] = useState('')
  const [targetShares, setTargetShares] = useState(100)
  const [shareUnitPrice, setShareUnitPrice] = useState(1000)
  const [workerPercent, setWorkerPercent] = useState(20)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (project) {
      setName(project.name || '')
      setWorkerName(project.workerName || '')
      setTargetShares(project.targetShares || 100)
      setShareUnitPrice(project.shareUnitPrice || 1000)
      setWorkerPercent(project.workerProfitPercentage || 20)
    } else {
      setName(''); setWorkerName(''); setTargetShares(100); setShareUnitPrice(1000); setWorkerPercent(20)
    }
    setError(null)
  }, [project, isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      const payload = {
        name,
        workerName: workerName || 'المضارب',
        targetShares: Number(targetShares),
        shareUnitPrice: Number(shareUnitPrice),
        workerProfitPercentage: Number(workerPercent)
      }
      if (project?.id) {
        await apiClient.patch(`/api/projects/${project.id}`, payload)
      } else {
        await apiClient.post('/api/projects', payload)
      }
      onSaved(); onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل حفظ المشروع')
    } finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" dir="rtl">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-slate-800">
          <h2 className="text-base font-bold text-white">{project ? 'تعديل مشروع المضاربة' : 'إضافة مشروع جديد'}</h2>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        {error && <div className="p-2 text-xs text-rose-400 bg-rose-500/10 rounded-lg">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" placeholder="اسم المشروع" />
          <input value={workerName} onChange={(e) => setWorkerName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" placeholder="اسم العامل (المضارب)" />
          <div className="grid grid-cols-2 gap-2">
            <input type="number" min="1" value={targetShares} onChange={(e) => setTargetShares(Number(e.target.value))} placeholder="الأسهم المستهدفة" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
            <input type="number" min="0.0001" step="any" required value={shareUnitPrice} onChange={(e) => setShareUnitPrice(Number(e.target.value))} placeholder="سعر السهم (ج)" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
          </div>
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">نسبة العامل من الأرباح (%): {workerPercent}% (للشركاء {100 - Number(workerPercent)}%)</label>
            <input type="number" min="0" max="100" value={workerPercent} onChange={(e) => setWorkerPercent(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
          </div>
          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={loading} className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold">{loading ? 'جاري الحفظ...' : 'حفظ البيانات'}</button>
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs">إلغاء</button>
          </div>
        </form>
      </div>
    </div>
  )
}

