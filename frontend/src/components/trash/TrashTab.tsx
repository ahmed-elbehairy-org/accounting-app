import { Trash2 } from 'lucide-react'
import { TrashRow } from './TrashRow'

export interface DeletedRecord {
  id: string
  category: 'partners' | 'projects' | 'cashflows' | 'liquidations' | 'advances'
  categoryLabel: string
  title: string
  deletedAt?: string
}

interface Props {
  items: DeletedRecord[]
  onRestore: (category: DeletedRecord['category'], id: string) => void
  onPermanentDelete: (category: DeletedRecord['category'], id: string) => void
}

export function TrashTab({ items, onRestore, onPermanentDelete }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trash2 className="w-5 h-5 text-rose-400" />
          <h2 className="text-lg font-bold text-white">سلة المحذوفات (Soft Delete)</h2>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
          {items.length} عنصر محذوف
        </span>
      </div>

      {items.length === 0 ? (
        <div className="p-16 text-center text-slate-500 bg-slate-900/20 border border-slate-800 rounded-2xl text-sm">
          سلة المحذوفات فارغة. لا توجد عناصر محذوفة مؤقتاً.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">النوع</th>
                <th className="p-3">العنصر</th>
                <th className="p-3">تاريخ الحذف</th>
                <th className="p-3 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {items.map((item) => (
                <TrashRow
                  key={`${item.category}-${item.id}`}
                  item={item}
                  onRestore={onRestore}
                  onPermanentDelete={onPermanentDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
