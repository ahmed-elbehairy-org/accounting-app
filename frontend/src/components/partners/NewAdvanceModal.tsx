import { useState } from 'react'
import { apiClient } from '../../services/apiClient'
import type { Partner } from '../../types'
import { X, HandCoins } from 'lucide-react'

interface Props {
  partner: Partner | null
  onClose: () => void
  onCreated: () => void
}

export function NewAdvanceModal({ partner, onClose, onCreated }: Props) {
  const [amount, setAmount] = useState<number | ''>('')
  const [reason, setReason] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!partner) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || Number(amount) <= 0) return setError('المبلغ غير صالح')
    setLoading(true)
    setError(null)
    try {
      await apiClient.post('/api/advances', {
        partnerId: partner.id,
        amount: Number(amount),
        reason: reason || 'سلفة أرباح مقدمة',
        date,
        deductionType: 'profit_advance'
      })
      onCreated()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل صرف السلفة')
    } finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" dir="rtl">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2 text-rose-400">
            <HandCoins className="w-5 h-5" />
            <h2 className="text-base font-bold text-white">صرف سلفة للشريك: {partner.name}</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        {error && <div className="p-2 text-xs text-rose-400 bg-rose-500/10 rounded-lg">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-slate-400 block mb-1">المبلغ المطلوب صرفه (ج)</label>
            <input type="number" min="1" step="0.01" required value={amount} onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" placeholder="5000" />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">السبب / البيان</label>
            <input value={reason} onChange={(e) => setReason(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" placeholder="دفعة تحت الحساب / سلفة نقدية" />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">التاريخ</label>
            <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
          </div>
          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={loading} className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold">{loading ? 'جاري الصرف...' : 'تأكيد صرف السلفة'}</button>
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs">إلغاء</button>
          </div>
        </form>
      </div>
    </div>
  )
}

