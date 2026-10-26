import { useState } from 'react'
import { X, LayersPlus } from 'lucide-react'
import type { Product, CashflowItem, ProductCostItem } from '../../types/accounting'

interface Props {
  product: Product | null
  cashflows: CashflowItem[]
  onClose: () => void
  onSaveCost: (cost: Omit<ProductCostItem, 'id'>) => void
}

export function AllocateCostModal({ product, cashflows, onClose, onSaveCost }: Props) {
  const [costType, setCostType] = useState('زيوت وخامات عطرية')
  const [allocatedAmount, setAllocatedAmount] = useState<number>(500)
  const [cashflowId, setCashflowId] = useState('')

  if (!product) return null
  const projectOutflows = cashflows.filter((c) => c.projectId === product.projectId && c.type === 'outflow')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (allocatedAmount <= 0) return
    onSaveCost({
      productId: product.id,
      costType: costType.trim(),
      allocatedAmount: Number(allocatedAmount),
      cashflowId: cashflowId || undefined
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayersPlus className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-slate-100">تخصيص بند صادر لتكلفة المنتج</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-3.5">
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
            المنتج: <span className="font-bold text-white">{product.name}</span> (دفعة {product.unitsProduced} قطعة)
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">بيان بند التكلفة *</label>
            <input type="text" required value={costType} onChange={(e) => setCostType(e.target.value)} placeholder="مثال: زجاجات العطور، مضخات، تغليف فاخر..." className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500" />
          </div>

          {projectOutflows.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">ربط بقيد صادر من سجل المصروفات (اختياري)</label>
              <select value={cashflowId} onChange={(e) => setCashflowId(e.target.value)} className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-indigo-500">
                <option value="">-- إدخال مباشر بدون ربط بقيد --</option>
                {projectOutflows.map((c) => (
                  <option key={c.id} value={c.id}>${c.amount} - {c.description || c.category} ({c.entryDate})</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">المبلغ المخصص للمنتج ($) *</label>
            <input type="number" min={0.01} step="any" required value={allocatedAmount} onChange={(e) => setAllocatedAmount(Number(e.target.value))} className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500" />
          </div>

          <div className="pt-2 flex gap-3 justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition">إلغاء</button>
            <button type="submit" className="px-5 py-2 rounded-xl text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition">إضافة للتكلفة</button>
          </div>
        </form>
      </div>
    </div>
  )
}
