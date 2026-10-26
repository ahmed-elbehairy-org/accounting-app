import { useState } from 'react'
import { X, Briefcase } from 'lucide-react'
import type { TradingRound } from '../../types/mudharaba'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSave: (round: Omit<TradingRound, 'id' | 'totalAllocatedShares' | 'status'>) => void
}

export function NewRoundModal({ isOpen, onClose, onSave }: Props) {
  const [title, setTitle] = useState('')
  const [shareUnitPrice, setShareUnitPrice] = useState(1000)
  const [targetShares, setTargetShares] = useState(100)
  const [managerProfitCutPercent, setManagerProfitCutPercent] = useState(25)
  const [description, setDescription] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onSave({
      title: title.trim(), startDate: new Date().toISOString().split('T')[0],
      shareUnitPrice: Number(shareUnitPrice), targetShares: Number(targetShares),
      managerProfitCutPercent: Number(managerProfitCutPercent), description: description.trim()
    })
    setTitle(''); setDescription(''); onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-slate-100">إنشاء جولة مضاربة تجارية جديدة</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">عنوان الصفقة أو الجولة *</label>
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="مثال: تجارة المواد الغذائية" className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">سعر السهم ($) *</label>
              <input type="number" min={1} required value={shareUnitPrice} onChange={(e) => setShareUnitPrice(Number(e.target.value))} className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">الأسهم المستهدفة *</label>
              <input type="number" min={1} required value={targetShares} onChange={(e) => setTargetShares(Number(e.target.value))} className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500" />
            </div>
          </div>

          <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between text-xs">
            <span className="text-slate-400">رأس المال المستهدف:</span>
            <span className="font-bold text-indigo-400">${(shareUnitPrice * targetShares).toLocaleString()}</span>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>نسبة ربح المضارب *</span>
              <span className="text-indigo-400 font-bold">{managerProfitCutPercent}%</span>
            </div>
            <input type="range" min={0} max={50} step={5} value={managerProfitCutPercent} onChange={(e) => setManagerProfitCutPercent(Number(e.target.value))} className="w-full accent-indigo-600" />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">وصف الصفقة</label>
            <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="تفاصيل البضاعة..." className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500" />
          </div>

          <div className="pt-2 flex gap-3 justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition">إلغاء</button>
            <button type="submit" className="px-5 py-2 rounded-xl text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition">إطلاق الجولة</button>
          </div>
        </form>
      </div>
    </div>
  )
}
