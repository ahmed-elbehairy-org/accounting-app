import { useState } from 'react'
import { X, Layers, Check } from 'lucide-react'
import type { TradingRound, Partner, ShareInvestment } from '../../types/mudharaba'

interface Props {
  round: TradingRound | null
  partners: Partner[]
  onClose: () => void
  onAllocate: (investment: Omit<ShareInvestment, 'id'>) => void
}

export function AllocateSharesModal({ round, partners, onClose, onAllocate }: Props) {
  const [selectedPartnerId, setSelectedPartnerId] = useState('')
  const [shareCount, setShareCount] = useState<number>(10)

  if (!round) return null
  const remainingShares = Math.max(0, round.targetShares - round.totalAllocatedShares)
  const totalAmount = shareCount * round.shareUnitPrice

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPartnerId || shareCount <= 0) return
    onAllocate({
      partnerId: selectedPartnerId, roundId: round.id,
      shareCount: Number(shareCount), shareUnitPrice: round.shareUnitPrice,
      totalAmount, date: new Date().toISOString().split('T')[0]
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-slate-100">اكتتاب أسهم لشريك</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-1">
            <div className="font-semibold text-slate-200">{round.title}</div>
            <div className="text-slate-400 flex justify-between">
              <span>سعر السهم: ${round.shareUnitPrice}</span>
              <span>المتاح: {remainingShares} سهم</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">اختيار الشريك *</label>
            <select
              required value={selectedPartnerId} onChange={(e) => setSelectedPartnerId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
            >
              <option value="">-- حدد الشريك --</option>
              {partners.map((p) => (
                <option key={p.id} value={p.id}>{p.name} ({p.activeSharesCount} سهم)</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">عدد الأسهم *</label>
            <input
              type="number" min={1} required value={shareCount}
              onChange={(e) => setShareCount(Math.max(1, Number(e.target.value)))}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="p-3 bg-indigo-950/30 border border-indigo-900/40 rounded-xl flex items-center justify-between text-xs">
            <span className="text-indigo-300 font-medium">المبلغ الإجمالي المستحق:</span>
            <span className="text-base font-bold text-indigo-400">${totalAmount.toLocaleString()}</span>
          </div>

          <div className="pt-2 flex gap-3 justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition">
              إلغاء
            </button>
            <button type="submit" className="px-5 py-2 rounded-xl text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              تأكيد الاكتتاب
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
