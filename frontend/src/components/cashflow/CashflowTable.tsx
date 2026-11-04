import type { CashflowItem } from '../../types'
import { DeleteButton } from '../common/DeleteButton'
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'

interface Props {
  items: CashflowItem[]
  loading: boolean
  onDelete: (id: string) => void
}

export function CashflowTable({ items, loading, onDelete }: Props) {
  if (loading) {
    return <div className="text-center py-10 text-xs text-slate-500">جاري تحميل القيود المالية...</div>
  }

  if (items?.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-900/30 border border-dashed border-slate-800 rounded-2xl">
        <p className="text-slate-400 text-xs">لا توجد حركات صادر أو وارد مسجلة</p>
      </div>
    )
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-right text-xs">
          <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">التاريخ</th>
              <th className="py-3 px-4">النوع</th>
              <th className="py-3 px-4">التصنيف</th>
              <th className="py-3 px-4">الوصف</th>
              <th className="py-3 px-4">المبلغ</th>
              <th className="py-3 px-4 text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-200">
            {items?.map((item) => {
              const isInflow = item.type === 'inflow'
              return (
                <tr key={item.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-3 px-4 font-mono text-slate-400">{item.entryDate}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                      isInflow
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}>
                      {isInflow ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                      {isInflow ? 'وارد (إيراد)' : 'صادر (مصروف)'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{item.category}</td>
                  <td className="py-3 px-4 text-slate-400 max-w-xs truncate">{item.description || '-'}</td>
                  <td className={`py-3 px-4 font-bold font-mono ${isInflow ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isInflow ? '+' : '-'}{Number(item.amount).toLocaleString()} ج
                  </td>
                  <td className="py-3 px-4 text-center">
                    <DeleteButton onDelete={() => onDelete(item.id)} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

