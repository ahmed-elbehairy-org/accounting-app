import { useState, useMemo } from 'react'
import { X, Calculator, ArrowRight, Printer } from 'lucide-react'
import type { TradingRound, AppState } from '../../types/mudharaba'
import { calculateRoundLiquidation, executeLiquidation } from '../../utils/mudharabaEngine'
import { LiquidationCompletedView } from './LiquidationCompletedView'
import { LiquidationStepReview } from './LiquidationStepReview'

interface Props {
  round: TradingRound | null
  state: AppState
  onClose: () => void
  onCommitLiquidation: (updatedState: AppState) => void
}

export function LiquidationWizard({ round, state, onClose, onCommitLiquidation }: Props) {
  if (!round) return null

  const roundInvs = state.investments.filter((inv) => inv.roundId === round.id)
  const initialPool = roundInvs.reduce((sum, inv) => sum + inv.totalAmount, 0)
  const [finalAssetValue, setFinalAssetValue] = useState<number>(initialPool ? Math.round(initialPool * 1.2) : 50000)
  const [step, setStep] = useState<1 | 2>(1)
  const [notes, setNotes] = useState('')

  const simulation = useMemo(() => calculateRoundLiquidation(state, round.id, Number(finalAssetValue)), [state, round.id, finalAssetValue])

  const handleFinalize = () => {
    if (!simulation) return
    onCommitLiquidation(executeLiquidation(state, simulation, notes))
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl my-6 print:m-0 print:border-none print:bg-white print:text-black">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between print:border-black">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-indigo-400 print:text-black" />
            <div>
              <h3 className="font-bold text-slate-100 text-base print:text-black">
                {round.status === 'liquidated' ? 'تقرير التصفية والمقاصة النهائية' : 'معالج تصفية الجولة والمقاصة'}
              </h3>
              <p className="text-xs text-slate-400 print:text-gray-600">الجولة: {round.title} • رأس المال: ${initialPool.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 print:hidden">
            <button onClick={() => window.print()} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition">
              <Printer className="w-4 h-4" />طباعة
            </button>
            <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"><X className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {round.status === 'liquidated' ? (
            <LiquidationCompletedView round={round} state={state} />
          ) : step === 1 ? (
            <div className="space-y-4">
              <p className="text-xs text-slate-300">أدخل إجمالي القيمة النقدية الفعلية بعد بيع البضاعة وحصر الصندوق لحساب الأرباح واقتطاع نسبة المضارب.</p>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">إجمالي القيمة المحققة للتصفية ($) *</label>
                <input
                  type="number" min={0} value={finalAssetValue} onChange={(e) => setFinalAssetValue(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-base font-bold focus:outline-none focus:border-indigo-500"
                />
              </div>

              {simulation && (
                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/70 grid grid-cols-3 gap-3 text-center">
                  <div><span className="text-xs text-slate-400 block">النتيجة</span><span className={`text-base font-bold mt-0.5 block ${simulation.isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>{simulation.isProfit ? '+' : ''}${simulation.grossProfit.toLocaleString()}</span></div>
                  <div><span className="text-xs text-slate-400 block">المضارب ({simulation.managerCutPercent}%)</span><span className="text-base font-bold text-indigo-400 mt-0.5 block">+${simulation.managerProfit.toLocaleString()}</span></div>
                  <div><span className="text-xs text-slate-400 block">المستثمرون</span><span className="text-base font-bold text-cyan-400 mt-0.5 block">+${simulation.investorsProfitPool.toLocaleString()}</span></div>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button type="button" onClick={() => setStep(2)} className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition shadow-lg shadow-indigo-600/30">
                  <span>الانتقال لجدول المقاصة</span><ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <LiquidationStepReview
              simulation={simulation} notes={notes}
              onNotesChange={(n) => setNotes(n)} onBack={() => setStep(1)} onFinalize={handleFinalize}
            />
          )}
        </div>
      </div>
    </div>
  )
}
