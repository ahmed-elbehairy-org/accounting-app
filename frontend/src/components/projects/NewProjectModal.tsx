import { useState } from 'react'
import { X, FolderPlus } from 'lucide-react'
import type { Project } from '../../types/accounting'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSave: (p: Omit<Project, 'id' | 'createdAt'>) => void
}

export function NewProjectModal({ isOpen, onClose, onSave }: Props) {
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [description, setDescription] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onSave({
      name: name.trim(),
      code: (code || `PRJ-${Date.now().toString().slice(-4)}`).trim().toUpperCase(),
      description: description.trim(),
      status: 'active'
    })
    setName(''); setCode(''); setDescription('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-slate-100">إضافة مشروع تجاري جديد</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">اسم المشروع *</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: طين للعطور" className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500" />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">كود المشروع (اختياري)</label>
            <input type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="مثال: TEEN-PERF" className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500 uppercase" />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">وصف المشروع أو النشاط</label>
            <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="مجال التجارة، تفاصيل الشراكة..." className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500" />
          </div>

          <div className="pt-2 flex gap-3 justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition">إلغاء</button>
            <button type="submit" className="px-5 py-2 rounded-xl text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition">حفظ المشروع</button>
          </div>
        </form>
      </div>
    </div>
  )
}
