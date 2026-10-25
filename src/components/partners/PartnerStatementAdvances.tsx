import type { AdvanceLoan } from '../../types/mudharaba'

interface Props {
  advances: AdvanceLoan[]
}

export function PartnerStatementAdvances({ advances }: Props) {
  return (
    <div>
      <h4 className="text-xs font-semibold text-slate-300 mb-2 print:text-black">سجل السلف والمسحوبات الشخصية</h4>
      <div className="border border-slate-800 rounded-xl overflow-hidden print:border-black">
        <table className="w-full text-right text-xs">
          <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 print:bg-gray-200 print:text-black">
            <tr>
              <th className="p-2.5">التاريخ</th>
              <th className="p-2.5">المبلغ</th>
              <th className="p-2.5">النوع</th>
              <th className="p-2.5">البيان</th>
              <th className="p-2.5">الحالة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 print:divide-gray-300">
            {advances.length === 0 ? (
              <tr><td colSpan={5} className="p-3 text-center text-slate-500">لا توجد سلف أو مسحوبات</td></tr>
            ) : (
              advances.map((adv) => (
                <tr key={adv.id} className="hover:bg-slate-800/40">
                  <td className="p-2.5 text-slate-400 print:text-gray-700">{adv.date}</td>
                  <td className="p-2.5 font-bold text-rose-400 print:text-black">${adv.amount.toLocaleString()}</td>
                  <td className="p-2.5 text-slate-300 print:text-gray-700">{adv.deductionType === 'profit_advance' ? 'تحت حساب الأرباح' : 'من رأس المال'}</td>
                  <td className="p-2.5 text-slate-400 print:text-gray-700">{adv.reason}</td>
                  <td className="p-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${adv.status === 'open' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                      {adv.status === 'open' ? 'قائمة' : 'مسددة'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
