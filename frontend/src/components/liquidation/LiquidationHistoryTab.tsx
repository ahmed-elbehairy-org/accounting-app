import type { AppState } from '../../types/mudharaba'

interface Props {
  state: AppState
  onGoToRounds: () => void
}

export function LiquidationHistoryTab({ state, onGoToRounds }: Props) {
  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-100 text-base">سجل التصفيات والمقاصة</h3>
          <p className="text-xs text-slate-400 mt-1">
            تصفية الجولات، استرداد رأس المال، اقتطاع حصة المضارب، وخصم السلف والمسحوبات تلقائياً.
          </p>
        </div>
        <button
          onClick={onGoToRounds}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-xl transition"
        >
          تصفية جولة نشطة الآن
        </button>
      </div>

      <div className="border border-slate-800 rounded-2xl bg-slate-900/30 overflow-hidden">
        <table className="w-full text-right text-xs">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="p-3">تاريخ التصفية</th>
              <th className="p-3">الجولة التجارية</th>
              <th className="p-3">رأس المال الأصلي</th>
              <th className="p-3">القيمة المحققة</th>
              <th className="p-3">صافي الأرباح</th>
              <th className="p-3">أرباح المضارب</th>
              <th className="p-3">أرباح الشركاء</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {state.liquidations.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500">
                  لا توجد تصفيات مكتملة حتى الآن
                </td>
              </tr>
            ) : (
              state.liquidations.map((l) => {
                const round = state.rounds.find((r) => r.id === l.roundId)
                return (
                  <tr key={l.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 text-slate-400">{l.liquidationDate}</td>
                    <td className="p-3 font-semibold text-slate-200">{round?.title || l.roundId}</td>
                    <td className="p-3 text-slate-300">${l.initialCapital.toLocaleString()}</td>
                    <td className="p-3 font-bold text-slate-100">${l.finalAssetValue.toLocaleString()}</td>
                    <td className="p-3 font-bold text-emerald-400">+${l.grossProfitOrLoss.toLocaleString()}</td>
                    <td className="p-3 font-bold text-indigo-400">+${l.managerProfit.toLocaleString()}</td>
                    <td className="p-3 font-bold text-cyan-400">+${l.investorsProfitPool.toLocaleString()}</td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
