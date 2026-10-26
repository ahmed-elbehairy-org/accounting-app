import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import type { CashflowItem, Project } from '../../types/accounting'

interface Props {
  items: CashflowItem[]
  projects: Project[]
}

const CATEGORY_NAMES: Record<string, string> = {
  raw_material: 'خامات وزيوت',
  bottles_packaging: 'زجاجات وتغليف',
  shipping: 'شحن وتوصيل',
  sales: 'مبيعات',
  marketing: 'تسويق',
  general: 'عام'
}

export function CashflowTable({ items, projects }: Props) {
  if (items.length === 0) {
    return <div className="p-8 text-center text-slate-500 text-xs">لا توجد قيود صادر أو وارد مطابقة</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-right text-xs">
        <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
          <tr>
            <th className="p-3">النوع</th>
            <th className="p-3">المشروع</th>
            <th className="p-3">التصنيف</th>
            <th className="p-3">المبلغ</th>
            <th className="p-3">البيان</th>
            <th className="p-3">التاريخ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {items.map((item) => {
            const project = projects.find((p) => p.id === item.projectId)
            const isOut = item.type === 'outflow'
            return (
              <tr key={item.id} className="hover:bg-slate-800/40 transition">
                <td className="p-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${isOut ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                    {isOut ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                    {isOut ? 'صادر' : 'وارد'}
                  </span>
                </td>
                <td className="p-3 font-semibold text-slate-100">{project?.name || item.projectId}</td>
                <td className="p-3 text-slate-300">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-[11px]">{CATEGORY_NAMES[item.category] || item.category}</span>
                </td>
                <td className={`p-3 font-bold text-sm ${isOut ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {isOut ? '-' : '+'}${item.amount.toLocaleString()}
                </td>
                <td className="p-3 text-slate-400 max-w-xs truncate">{item.description || '-'}</td>
                <td className="p-3 text-slate-400">{item.entryDate}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
