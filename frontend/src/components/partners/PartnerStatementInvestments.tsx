import type { ShareInvestment, TradingRound } from '../../types/mudharaba'

interface Props {
  investments: ShareInvestment[]
  rounds: TradingRound[]
}

export function PartnerStatementInvestments({ investments, rounds }: Props) {
  return (
    <div>
      <h4 className="text-xs font-semibold text-slate-300 mb-2 print:text-black">سجل المساهمات والأسهم</h4>
      <div className="border border-slate-800 rounded-xl overflow-hidden print:border-black">
        <table className="w-full text-right text-xs">
          <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 print:bg-gray-200 print:text-black">
            <tr>
              <th className="p-2.5">الجولة التجارية</th>
              <th className="p-2.5">التاريخ</th>
              <th className="p-2.5">الأسهم</th>
              <th className="p-2.5">سعر السهم</th>
              <th className="p-2.5">إجمالي المساهمة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 print:divide-gray-300">
            {investments.length === 0 ? (
              <tr><td colSpan={5} className="p-3 text-center text-slate-500">لا توجد مساهمات</td></tr>
            ) : (
              investments.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-800/40">
                  <td className="p-2.5 font-medium text-slate-200 print:text-black">{rounds.find((r) => r.id === inv.roundId)?.title || inv.roundId}</td>
                  <td className="p-2.5 text-slate-400 print:text-gray-700">{inv.date}</td>
                  <td className="p-2.5 text-indigo-400 font-semibold print:text-black">{inv.shareCount}</td>
                  <td className="p-2.5 text-slate-400 print:text-gray-700">${inv.shareUnitPrice}</td>
                  <td className="p-2.5 font-bold text-slate-100 print:text-black">${inv.totalAmount.toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
