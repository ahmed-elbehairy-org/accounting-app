import { RotateCcw, Trash2 } from 'lucide-react'
import type { DeletedRecord } from './TrashTab'

interface Props {
  item: DeletedRecord
  onRestore: (category: DeletedRecord['category'], id: string) => void
  onPermanentDelete: (category: DeletedRecord['category'], id: string) => void
}

export function TrashRow({ item, onRestore, onPermanentDelete }: Props) {
  const handlePermanent = () => {
    if (window.confirm(`هل أنت متأكد من حذف "${item.title}" نهائياً؟ لا يمكن التراجع عن هذا الإجراء.`)) {
      onPermanentDelete(item.category, item.id)
    }
  }

  return (
    <tr className="hover:bg-slate-800/40 transition">
      <td className="p-3">
        <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
          {item.categoryLabel}
        </span>
      </td>
      <td className="p-3 font-medium text-slate-100">{item.title}</td>
      <td className="p-3 text-slate-400">
        {item.deletedAt ? new Date(item.deletedAt).toLocaleString('ar-EG') : '-'}
      </td>
      <td className="p-3 text-center">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => onRestore(item.category, item.id)}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-lg text-[11px] font-medium transition"
          >
            <RotateCcw className="w-3 h-3" />
            استعادة
          </button>
          <button
            onClick={handlePermanent}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded-lg text-[11px] font-medium transition"
          >
            <Trash2 className="w-3 h-3" />
            حذف نهائي
          </button>
        </div>
      </td>
    </tr>
  )
}

