import { CheckCircle2 } from 'lucide-react'
import type { TradingRound, AppState } from '../../types/mudharaba'

interface Props {
  round: TradingRound
  state: AppState
}

export function LiquidationCompletedView({ round, state }: Props) {
  const liq = state.liquidations.find((l) => l.roundId === round.id)
  const settlements = state.settlements.filter((s) => s.roundId === round.id)

  return (
    <div className="space-y-5">
      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2 print:border-gray-400 print:text-black">
        <CheckCircle2 className="w-4 h-4 shrink-0" />
        <span>تم اعتماد هذه التصفية وإغلاق حسابات الجولة رسمياً ومقاصة السلف.</span>
      </div>

      {liq && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 print:bg-gray-100">
            <span className="text-[11px] text-slate-400 block">القيمة المحققة</span>
            <span className="text-base font-bold text-slate-100 print:text-black mt-0.5 block">${liq.finalAssetValue.toLocaleString()}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 print:bg-gray-100">
            <span className="text-[11px] text-slate-400 block">صافي الأرباح</span>
            <span className="text-base font-bold text-emerald-400 print:text-black mt-0.5 block">+${liq.grossProfitOrLoss.toLocaleString()}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 print:bg-gray-100">
            <span className="text-[11px] text-slate-400 block">حصة المضارب</span>
            <span className="text-base font-bold text-indigo-400 print:text-black mt-0.5 block">+${liq.managerProfit.toLocaleString()}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 print:bg-gray-100">
            <span className="text-[11px] text-slate-400 block">أرباح المستثمرين</span>
            <span className="text-base font-bold text-cyan-400 print:text-black mt-0.5 block">+${liq.investorsProfitPool.toLocaleString()}</span>
          </div>
        </div>
      )}

      <div>
        <h4 className="text-xs font-semibold text-slate-300 mb-2 print:text-black">بيان صرف المستحقات وسداد المسحوبات</h4>
        <div className="border border-slate-800 rounded-xl overflow-hidden print:border-black">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 print:bg-gray-200 print:text-black">
              <tr>
                <th className="p-2.5">الشريك</th>
                <th className="p-2.5">الأسهم</th>
                <th className="p-2.5">رأس المال المسترد</th>
                <th className="p-2.5">حصة الربح</th>
                <th className="p-2.5">المسحوبات المخصومة</th>
                <th className="p-2.5">الصافي المنصرف</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 print:divide-gray-300">
              {settlements.map((s) => (
                <tr key={s.id} className="hover:bg-slate-800/40">
                  <td className="p-2.5 font-semibold text-slate-200 print:text-black">{state.partners.find((p) => p.id === s.partnerId)?.name || s.partnerId}</td>
                  <td className="p-2.5 text-slate-400 print:text-black">{s.sharesCount} سهم</td>
                  <td className="p-2.5 text-slate-300 print:text-black">${s.capitalReturned.toLocaleString()}</td>
                  <td className="p-2.5 text-emerald-400 font-bold print:text-black">+${s.profitShare.toLocaleString()}</td>
                  <td className="p-2.5 text-rose-400 print:text-black">-${s.deductedAdvances.toLocaleString()}</td>
                  <td className="p-2.5 font-bold text-indigo-400 print:text-black">${s.netPayable.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
