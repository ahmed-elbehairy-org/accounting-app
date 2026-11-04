import { useState, useEffect } from 'react'
import { apiClient } from '../../services/apiClient'
import { getSavedCategories, saveCategory, getSavedDescriptions, saveDescription } from '../../services/savedTransactionPresets'
import type { Project } from '../../types'
import { X } from 'lucide-react'

interface Props {
  isOpen: boolean
  projects: Project[]
  defaultProjectId?: string
  onClose: () => void
  onCreated: () => void
}

export function NewCashflowModal({ isOpen, projects, defaultProjectId, onClose, onCreated }: Props) {
  const [projectId, setProjectId] = useState(defaultProjectId || (projects[0]?.id ?? ''))
  const [type, setType] = useState<'inflow' | 'outflow'>('inflow')
  const [category, setCategory] = useState('مبيعات')
  const [amount, setAmount] = useState<number | ''>('')
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0])
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cats, setCats] = useState<string[]>([])
  const [descs, setDescs] = useState<string[]>([])

  useEffect(() => {
    if (isOpen) { setCats(getSavedCategories()); setDescs(getSavedDescriptions()) }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || Number(amount) <= 0) return setError('المبلغ غير صالح')
    setLoading(true); setError(null)
    try {
      await apiClient.post('/api/cashflow', {
        projectId: projectId || projects[0]?.id, type, category, amount: Number(amount), entryDate, description
      })
      saveCategory(category)
      if (description) saveDescription(description)
      onCreated(); onClose()
    } catch (err) { setError(err instanceof Error ? err.message : 'فشل تسجيل الحركة') }
    finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" dir="rtl">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-slate-800">
          <h2 className="text-base font-bold text-white">تسجيل حركة صادر / وارد</h2>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        {error && <div className="p-2 text-xs text-rose-400 bg-rose-500/10 rounded-lg">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <select value={projectId} onChange={(e) => setProjectId(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white">
            {projects?.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
          </select>
          <div className="grid grid-cols-2 gap-2">
            <select value={type} onChange={(e) => { const t = e.target.value as 'inflow' | 'outflow'; setType(t); setCategory(t === 'inflow' ? 'مبيعات' : 'مشتريات') }} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white">
              <option value="inflow">وارد (+ إيراد)</option>
              <option value="outflow">صادر (- مصروف)</option>
            </select>
            <input type="number" min="0.01" step="0.01" required value={amount} onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))} placeholder="المبلغ (ج)" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <input list="cat-suggestions" required value={category} placeholder="التصنيف / العنوان" onChange={(e) => setCategory(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
              <datalist id="cat-suggestions">{cats.map((c, i) => <option key={i} value={c} />)}</datalist>
            </div>
            <input type="date" required value={entryDate} onChange={(e) => setEntryDate(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
          </div>
          <div>
            <input list="desc-suggestions" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" placeholder="البيان / الوصف (اختر من المحفوظ أو اكتب جديد)" />
            <datalist id="desc-suggestions">{descs.map((d, i) => <option key={i} value={d} />)}</datalist>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={loading} className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold">{loading ? 'جاري الحفظ...' : 'تسجيل القيد'}</button>
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs">إلغاء</button>
          </div>
        </form>
      </div>
    </div>
  )
}
