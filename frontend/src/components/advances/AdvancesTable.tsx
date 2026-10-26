import { CheckCircle, Clock } from 'lucide-react'
import type { AdvanceLoan, Partner } from '../../types/mudharaba'

interface Props {
  advances: AdvanceLoan[]
  partners: Partner[]
  onSettle: (id: string) => void
}

export function AdvancesTable({ advances, partners, onSettle }: Props) {
  if (advances.length === 0) {
    return <div className="p-8 text-center text-slate-500 text-xs">لا توجد مسحوبات أو سلف مطابقة</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-right text-xs">
        <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
          <tr>
            <th className="p-3">الشريك</th>
            <th className="p-3">المبلغ</th>
            <th className="p-3">النوع</th>
            <th className="p-3">البيان</th>
            <th className="p-3">التاريخ</th>
            <th className="p-3">الحالة</th>
            <th className="p-3 text-center">إجراء</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {advances.map((adv) => {
            const partner = partners.find((p) => p.id === adv.partnerId)
            return (
              <tr key={adv.id} className="hover:bg-slate-800/40 transition">
                <td className="p-3 font-semibold text-slate-100">{partner?.name || 'شريك'}</td>
                <td className="p-3 font-bold text-rose-400">${adv.amount.toLocaleString()}</td>
                <td className="p-3 text-slate-300">
                  <span className="px-2 py-0.5 rounded text-[11px] bg-slate-800">
                    {adv.deductionType === 'profit_advance' ? 'تحت حساب الأرباح' : 'من رأس المال'}
                  </span>
                </td>
                <td className="p-3 text-slate-400 max-w-xs truncate">{adv.reason}</td>
                <td className="p-3 text-slate-400">{adv.date}</td>
                <td className="p-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${adv.status === 'open' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                    {adv.status === 'open' ? <><Clock className="w-3 h-3" /> قائمة</> : <><CheckCircle className="w-3 h-3" /> مسددة</>}
                  </span>
                </td>
                <td className="p-3 text-center">
                  {adv.status === 'open' ? (
                    <button
                      onClick={() => onSettle(adv.id)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-[11px] transition"
                    >
                      سداد نقدي
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-500">تمت التسوية</span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
