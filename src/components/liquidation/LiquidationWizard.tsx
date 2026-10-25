import { useState, useMemo } from 'react'
import {
  X,
  Calculator,
  ArrowRight,
  CheckCircle2,
  Printer
} from 'lucide-react'
import type { TradingRound, AppState } from '../../types/mudharaba'
import {
  calculateRoundLiquidation,
  executeLiquidation
} from '../../utils/mudharabaEngine'
import type { RoundLiquidationSimulation } from '../../utils/mudharabaEngine'


interface Props {
  round: TradingRound | null
  state: AppState
  onClose: () => void
  onCommitLiquidation: (updatedState: AppState) => void
}

export function LiquidationWizard({ round, state, onClose, onCommitLiquidation }: Props) {
  if (!round) return null

  const roundInvestments = state.investments.filter((inv) => inv.roundId === round.id)
  const initialPool = roundInvestments.reduce((sum, inv) => sum + inv.totalAmount, 0)

  const [finalAssetValue, setFinalAssetValue] = useState<number>(initialPool ? Math.round(initialPool * 1.25) : 100000)
  const [step, setStep] = useState<1 | 2>(1)
  const [notes, setNotes] = useState('')

  // Calculate simulated liquidation
  const simulation: RoundLiquidationSimulation | null = useMemo(() => {
    return calculateRoundLiquidation(state, round.id, Number(finalAssetValue))
  }, [state, round.id, finalAssetValue])

  const handleFinalize = () => {
    if (!simulation) return
    const newState = executeLiquidation(state, simulation, notes)
    onCommitLiquidation(newState)
    onClose()
  }

  const existingLiquidation = state.liquidations.find((l) => l.roundId === round.id)
  const existingSettlements = state.settlements.filter((s) => s.roundId === round.id)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl my-6 print:m-0 print:border-none print:bg-white print:text-black">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between print:border-black">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-indigo-400 print:text-black" />
            <div>
              <h3 className="font-bold text-slate-100 text-lg print:text-black">
                {round.status === 'liquidated' ? 'تقرير التصفية والمقاصة النهائية' : 'معالج تصفية الجولة والمقاصة'}
              </h3>
              <p className="text-xs text-slate-400 print:text-gray-600">
                الجولة: {round.title} • رأس المال الأصلي: ${initialPool.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
            >
              <Printer className="w-4 h-4" />
              طباعة التقرير
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {round.status === 'liquidated' ? (
            /* Already Liquidated View */
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm flex items-center gap-2 print:border-gray-400 print:text-black">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>تم اعتماد هذه التصفية وإغلاق حسابات الجولة ومقاصة السلف رسمياً.</span>
              </div>

              {existingLiquidation && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 print:bg-gray-100 print:border-gray-300">
                    <span className="text-xs text-slate-400 block">إجمالي القيمة المحققة</span>
                    <span className="text-lg font-bold text-slate-100 print:text-black mt-1 block">
                      ${existingLiquidation.finalAssetValue.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 print:bg-gray-100 print:border-gray-300">
                    <span className="text-xs text-slate-400 block">صافي أرباح الجولة</span>
                    <span className="text-lg font-bold text-emerald-400 print:text-black mt-1 block">
                      +${existingLiquidation.grossProfitOrLoss.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 print:bg-gray-100 print:border-gray-300">
                    <span className="text-xs text-slate-400 block">حصة المضارب (إدارتك)</span>
                    <span className="text-lg font-bold text-indigo-400 print:text-black mt-1 block">
                      +${existingLiquidation.managerProfit.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 print:bg-gray-100 print:border-gray-300">
                    <span className="text-xs text-slate-400 block">أرباح الشركاء الموزعة</span>
                    <span className="text-lg font-bold text-cyan-400 print:text-black mt-1 block">
                      +${existingLiquidation.investorsProfitPool.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {/* Existing Settlements Table */}
              <div>
                <h4 className="text-sm font-semibold text-slate-300 mb-3 print:text-black">
                  بيان صرف المستحقات وسداد المسحوبات لكل شريك
                </h4>
                <div className="border border-slate-800 rounded-xl overflow-hidden print:border-black">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 print:bg-gray-200 print:text-black">
                      <tr>
                        <th className="p-3">اسم الشريك</th>
                        <th className="p-3">الأسهم</th>
                        <th className="p-3">رأس المال المسترد</th>
                        <th className="p-3">حصة الأرباح</th>
                        <th className="p-3">المسحوبات المخصومة</th>
                        <th className="p-3">الصافي المنصرف</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 print:divide-gray-300">
                      {existingSettlements.map((s) => {
                        const partner = state.partners.find((p) => p.id === s.partnerId)
                        return (
                          <tr key={s.id} className="hover:bg-slate-800/40">
                            <td className="p-3 font-semibold text-slate-200 print:text-black">
                              {partner?.name || s.partnerId}
                            </td>
                            <td className="p-3 text-slate-400 print:text-black">{s.sharesCount} سهم</td>
                            <td className="p-3 text-slate-300 print:text-black">${s.capitalReturned.toLocaleString()}</td>
                            <td className="p-3 text-emerald-400 font-bold print:text-black">+${s.profitShare.toLocaleString()}</td>
                            <td className="p-3 text-rose-400 print:text-black">-${s.deductedAdvances.toLocaleString()}</td>
                            <td className="p-3 font-bold text-indigo-400 print:text-black text-sm">
                              ${s.netPayable.toLocaleString()}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            /* Active Round: Wizard Flow */
            <div className="space-y-6">
              {/* Step Tracker */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 text-xs font-medium">
                <button
                  onClick={() => setStep(1)}
                  className={`flex items-center gap-2 ${step === 1 ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}
                >
                  <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px]">1</span>
                  تحديد أصول التصفية والقيمة المحققة
                </button>
                <div className="h-px w-12 bg-slate-800" />
                <button
                  onClick={() => setStep(2)}
                  className={`flex items-center gap-2 ${step === 2 ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}
                >
                  <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px]">2</span>
                  مراجعة جدول المقاصة وصافي الشركاء
                </button>
              </div>

              {step === 1 ? (
                <div className="space-y-5">
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
                    <span className="text-slate-400 block">شرح الخطوة الأولى:</span>
                    <p className="text-slate-300 leading-relaxed">
                      أدخل إجمالي القيمة النقدية الفعلية بعد بيع البضاعة وحصر الصندوق والبنك. سيقوم النظام آلياً
                      بمقارنة هذا المبلغ مع رأس مال الجولة (${initialPool.toLocaleString()}) لحساب الربح أو الخسارة واقتطاع نسبة المضارب.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                      إجمالي القيمة النقدية والأصول المحققة للتصفية ($) *
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={finalAssetValue}
                      onChange={(e) => setFinalAssetValue(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-lg font-bold focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {simulation && (
                    <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                      <div>
                        <span className="text-xs text-slate-400 block">النتيجة الإجمالية</span>
                        <span
                          className={`text-lg font-bold mt-1 block ${
                            simulation.isProfit ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {simulation.isProfit ? '+' : ''}${simulation.grossProfit.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block">حصة المضارب ({simulation.managerCutPercent}%)</span>
                        <span className="text-lg font-bold text-indigo-400 mt-1 block">
                          +${simulation.managerProfit.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block">صافي أرباح المستثمرين</span>
                        <span className="text-lg font-bold text-cyan-400 mt-1 block">
                          +${simulation.investorsProfitPool.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end pt-3">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition shadow-lg shadow-indigo-600/30"
                    >
                      <span>الانتقال لمراجعة جدول المقاصة</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Step 2: Review Table */
                <div className="space-y-5">
                  <div className="border border-slate-800 rounded-xl overflow-hidden">
                    <table className="w-full text-right text-xs">
                      <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                        <tr>
                          <th className="p-3">الشريك</th>
                          <th className="p-3">الأسهم</th>
                          <th className="p-3">رأس المال المسترد</th>
                          <th className="p-3">الأرباح المستحقة</th>
                          <th className="p-3">السلف المخصومة</th>
                          <th className="p-3">صافي المستحق للصرف</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {simulation?.partnerPayouts.map((p) => (
                          <tr key={p.partner.id} className="hover:bg-slate-800/40">
                            <td className="p-3 font-semibold text-slate-200">{p.partner.name}</td>
                            <td className="p-3 text-slate-400">
                              {p.sharesCount} سهم ({p.sharePercentage.toFixed(1)}%)
                            </td>
                            <td className="p-3 text-slate-300">${p.capitalReturned.toLocaleString()}</td>
                            <td className="p-3 text-emerald-400 font-bold">+${p.profitEarned.toLocaleString()}</td>
                            <td className="p-3 text-rose-400 font-semibold">
                              {p.totalAdvances > 0 ? `-$${p.totalAdvances.toLocaleString()}` : '$0'}
                            </td>
                            <td className="p-3 font-bold text-indigo-400 text-sm">
                              ${p.netPayable.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      ملاحظات أو توصيات التصفية الختامية
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="مثال: تم سداد جميع المستحقات نقداً وبشيكات بنكية"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition"
                    >
                      الرجوع لتعديل الأصول
                    </button>

                    <button
                      type="button"
                      onClick={handleFinalize}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl transition shadow-lg shadow-emerald-600/30"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>اعتماد التصفية والمقاصة النهائية</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
