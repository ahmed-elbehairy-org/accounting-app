import { useState } from 'react'
import { X, PackagePlus } from 'lucide-react'
import type { Project, Product } from '../../types/accounting'

interface Props {
  isOpen: boolean
  projects: Project[]
  onClose: () => void
  onSave: (p: Omit<Product, 'id'>) => void
}

export function NewProductModal({ isOpen, projects, onClose, onSave }: Props) {
  const [projectId, setProjectId] = useState('')
  const [name, setName] = useState('')
  const [sku, setSku] = useState('')
  const [unitsProduced, setUnitsProduced] = useState<number>(100)
  const [targetSellingPrice, setTargetSellingPrice] = useState<number>(30)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!projectId || !name.trim() || unitsProduced <= 0) return
    onSave({
      projectId, name: name.trim(),
      sku: (sku || `SKU-${Date.now().toString().slice(-4)}`).trim().toUpperCase(),
      unitsProduced: Number(unitsProduced),
      targetSellingPrice: Number(targetSellingPrice)
    })
    setName(''); setSku(''); onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PackagePlus className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-slate-100">إضافة دفعة منتج جديدة للتسعير</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">المشروع التابع له *</label>
            <select
              required value={projectId} onChange={(e) => setProjectId(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
            >
              <option value="">-- حدد المشروع --</option>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">اسم المنتج أو الدفعة *</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: عطر طين 50 مل - دفعة الشتاء" className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">عدد العبوات المنتجة *</label>
              <input type="number" min={1} required value={unitsProduced} onChange={(e) => setUnitsProduced(Number(e.target.value))} className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">سعر البيع المستهدف للقطعة ($)</label>
              <input type="number" min={0} step="any" value={targetSellingPrice} onChange={(e) => setTargetSellingPrice(Number(e.target.value))} className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500" />
            </div>
          </div>

          <div className="pt-2 flex gap-3 justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition">إلغاء</button>
            <button type="submit" className="px-5 py-2 rounded-xl text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition">حفظ الدفعة</button>
          </div>
        </form>
      </div>
    </div>
  )
}
