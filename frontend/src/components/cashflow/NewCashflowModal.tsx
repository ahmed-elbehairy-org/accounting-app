import { useState } from 'react'
import { X, Receipt } from 'lucide-react'
import type { Project, CashflowItem } from '../../types/accounting'

interface Props {
  isOpen: boolean
  projects: Project[]
  selectedProjectId?: string
  onClose: () => void
  onSave: (c: Omit<CashflowItem, 'id'>) => void
}

export function NewCashflowModal({ isOpen, projects, selectedProjectId, onClose, onSave }: Props) {
  const [projectId, setProjectId] = useState(selectedProjectId || '')
  const [type, setType] = useState<'inflow' | 'outflow'>('outflow')
  const [category, setCategory] = useState('raw_material')
  const [amount, setAmount] = useState<number>(100)
  const [description, setDescription] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!projectId || amount <= 0) return
    onSave({
      projectId, type, category, amount: Number(amount),
      entryDate: new Date().toISOString().split('T')[0], description: description.trim()
    })
    setDescription(''); setAmount(100); onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-indigo-400" /><h3 className="font-semibold text-slate-100">تسجيل قيد صادر / وارد</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button type="button" onClick={() => setType('inflow')} className={`p-2 rounded-xl border font-bold transition ${type === 'inflow' ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>وارد (إيراد)</button>
            <button type="button" onClick={() => setType('outflow')} className={`p-2 rounded-xl border font-bold transition ${type === 'outflow' ? 'bg-rose-950/40 border-rose-500/50 text-rose-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>صادر (مصروف)</button>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">المشروع *</label>
            <select required value={projectId} onChange={(e) => setProjectId(e.target.value)} className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500">
              <option value="">-- حدد المشروع --</option>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.code})</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">المبلغ ($) *</label>
              <input type="number" min={0.01} step="any" required value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">التصنيف</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500">
                <option value="raw_material">خامات وزيوت</option><option value="bottles_packaging">زجاجات وتغليف</option>
                <option value="shipping">شحن وتوصيل</option><option value="sales">مبيعات</option><option value="marketing">تسويق</option><option value="general">عام</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">البيان</label>
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="مثال: شراء كحول نقي، دفعة زجاجات..." className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500" />
          </div>

          <div className="pt-2 flex gap-3 justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition">إلغاء</button>
            <button type="submit" className="px-5 py-2 rounded-xl text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition">تسجيل القيد</button>
          </div>
        </form>
      </div>
    </div>
  )
}
