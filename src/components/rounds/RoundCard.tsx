import { Layers, Calculator, CheckCircle2, Calendar } from 'lucide-react'
import type { TradingRound, AppState } from '../../types/mudharaba'

interface Props {
  round: TradingRound
  state: AppState
  onAllocate: (round: TradingRound) => void
  onLiquidate: (round: TradingRound) => void
}

export function RoundCard({ round, state, onAllocate, onLiquidate }: Props) {
  const roundInvs = state.investments.filter((inv) => inv.roundId === round.id)
  const capital = roundInvs.reduce((sum, inv) => sum + inv.totalAmount, 0)
  const progress = Math.min(100, Math.round((round.totalAllocatedShares / round.targetShares) * 100))
  const liquidation = state.liquidations.find((l) => l.roundId === round.id)

  return (
    <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${round.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
            {round.status === 'active' ? '● جولة نشطة' : 'تمت التصفية'}
          </span>
          <span className="text-xs text-slate-500 flex items-center gap-1"><Calendar className="w-3 h-3" />{round.startDate}</span>
        </div>
        <h3 className="font-bold text-slate-100 text-base mt-2">{round.title}</h3>
        {round.description && <p className="text-xs text-slate-400 mt-1 line-clamp-2">{round.description}</p>}

        <div className="mt-3 p-2.5 bg-slate-950/70 border border-slate-800/80 rounded-xl grid grid-cols-3 gap-2 text-center text-xs">
          <div><span className="text-slate-400 block">سعر السهم</span><span className="font-bold text-white mt-0.5 block">${round.shareUnitPrice}</span></div>
          <div><span className="text-slate-400 block">نسبة المضارب</span><span className="font-bold text-indigo-400 mt-0.5 block">{round.managerProfitCutPercent}%</span></div>
          <div><span className="text-slate-400 block">رأس المال</span><span className="font-bold text-emerald-400 mt-0.5 block">${capital.toLocaleString()}</span></div>
        </div>

        <div className="mt-3 space-y-1">
          <div className="flex justify-between text-xs text-slate-400">
            <span>الاكتتاب</span>
            <span className="font-semibold text-slate-200">{round.totalAllocatedShares}/{round.targetShares} سهم ({progress}%)</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {liquidation && (
          <div className="mt-3 p-2 bg-emerald-950/20 border border-emerald-900/30 rounded-xl text-xs space-y-1">
            <div className="font-semibold text-emerald-300 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />ملخص التصفية:</div>
            <div className="flex justify-between text-slate-300"><span>صافي الربح:</span><span className="font-bold text-emerald-400">+${liquidation.grossProfitOrLoss.toLocaleString()}</span></div>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2">
        {round.status === 'active' ? (
          <>
            <button onClick={() => onAllocate(round)} className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />اكتتاب
            </button>
            <button onClick={() => onLiquidate(round)} className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition">
              <Calculator className="w-3.5 h-3.5" />تصفية
            </button>
          </>
        ) : (
          <button onClick={() => onLiquidate(round)} className="w-full inline-flex items-center justify-center gap-1 py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition">
            تقرير التصفية
          </button>
        )}
      </div>
    </div>
  )
}
