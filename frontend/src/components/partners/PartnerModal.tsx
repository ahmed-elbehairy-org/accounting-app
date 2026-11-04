import { useState, useEffect } from 'react'
import { apiClient } from '../../services/apiClient'
import type { Partner } from '../../types'
import { X } from 'lucide-react'

interface Props {
  isOpen: boolean
  partner?: Partner | null
  onClose: () => void
  onSaved: () => void
}

export function PartnerModal({ isOpen, partner, onClose, onSaved }: Props) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (partner) {
      setName(partner.name || '')
      setPhone(partner.phone || '')
      setNotes((partner as any).notes || '')
    } else {
      setName(''); setPhone(''); setNotes('')
    }
    setError(null)
  }, [partner, isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return setError('اسم الشريك مطلوب')
    setLoading(true); setError(null)
    try {
      if (partner?.id) {
        await apiClient.patch(`/api/partners/${partner.id}`, { name, phone, notes })
      } else {
        await apiClient.post('/api/partners', { name, phone, notes })
      }
      onSaved(); onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل حفظ الشريك')
    } finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" dir="rtl">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-slate-800">
          <h2 className="text-base font-bold text-white">{partner ? 'تعديل بيانات الشريك' : 'إضافة شريك جديد'}</h2>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        {error && <div className="p-2 text-xs text-rose-400 bg-rose-500/10 rounded-lg">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-slate-400 block mb-1">الاسم الكامل</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">الهاتف</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">ملاحظات</label>
            <input value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
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
