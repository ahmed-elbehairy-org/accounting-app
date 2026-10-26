import { useState } from 'react'
import { X, HandCoins, AlertCircle } from 'lucide-react'
import type { AdvanceLoan, Partner } from '../../types/mudharaba'

interface Props {
  isOpen: boolean
  partners: Partner[]
  onClose: () => void
  onSave: (advance: Omit<AdvanceLoan, 'id' | 'status' | 'settledAmount'>) => void
}

export function NewAdvanceModal({ isOpen, partners, onClose, onSave }: Props) {
  const [partnerId, setPartnerId] = useState('')
  const [amount, setAmount] = useState<number>(1000)
  const [deductionType, setDeductionType] = useState<'profit_advance' | 'capital_deduction'>('profit_advance')
  const [reason, setReason] = useState('')

  if (!isOpen) return null
  const partner = partners.find((p) => p.id === partnerId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!partnerId || amount <= 0) return
    onSave({
      partnerId, amount: Number(amount), deductionType,
      reason: reason.trim() || (deductionType === 'profit_advance' ? 'سحب تحت حساب الأرباح' : 'سلفة نقدية'),
      date: new Date().toISOString().split('T')[0]
    })
    setReason(''); setAmount(1000); onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HandCoins className="w-5 h-5 text-rose-400" />
            <h3 className="font-semibold text-slate-100">تسجيل سلفة / مسحوبات لشريك</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">الشريك المستلم *</label>
            <select
              required value={partnerId} onChange={(e) => setPartnerId(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
            >
              <option value="">-- حدد الشريك --</option>
              {partners.map((p) => (
                <option key={p.id} value={p.id}>{p.name} (${p.totalInvestedCapital.toLocaleString()})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">المبلغ المطلوب ($) *</label>
            <input type="number" min={1} required value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500" />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button type="button" onClick={() => setDeductionType('profit_advance')} className={`p-2.5 rounded-xl border text-right transition ${deductionType === 'profit_advance' ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-200' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
              <span className="font-bold block text-slate-100">تحت حساب الأرباح</span>
              <span className="text-[10px] text-slate-400">تخصم من الأرباح</span>
            </button>
            <button type="button" onClick={() => setDeductionType('capital_deduction')} className={`p-2.5 rounded-xl border text-right transition ${deductionType === 'capital_deduction' ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-200' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
              <span className="font-bold block text-slate-100">سلفة من رأس المال</span>
              <span className="text-[10px] text-slate-400">تخصم من الحصة</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">السبب أو البيان</label>
            <input type="text" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="مثال: مصاريف طارئة..." className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500" />
          </div>

          {partner && amount > partner.totalInvestedCapital * 0.5 && (
            <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-2 text-[11px] text-amber-300">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>المبلغ يمثل أكثر من 50% من رأس مال الشريك.</span>
            </div>
          )}

          <div className="pt-2 flex gap-3 justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition">إلغاء</button>
            <button type="submit" className="px-5 py-2 rounded-xl text-sm font-medium bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 transition">تسجيل السلفة</button>
          </div>
        </form>
      </div>
    </div>
  )
}
