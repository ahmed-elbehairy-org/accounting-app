import { useState } from 'react'
import { Plus, Layers, Calculator, CheckCircle2, Calendar } from 'lucide-react'
import type { TradingRound, ShareInvestment, AppState } from '../../types/mudharaba'

import { NewRoundModal } from './NewRoundModal'
import { AllocateSharesModal } from './AllocateSharesModal'

interface Props {
  state: AppState
  onAddRound: (round: Omit<TradingRound, 'id' | 'totalAllocatedShares' | 'status'>) => void
  onAllocateShares: (investment: Omit<ShareInvestment, 'id'>) => void
  onOpenLiquidation: (round: TradingRound) => void
}

export function RoundList({ state, onAddRound, onAllocateShares, onOpenLiquidation }: Props) {
  const [isNewRoundOpen, setIsNewRoundOpen] = useState(false)
  const [allocatingRound, setAllocatingRound] = useState<TradingRound | null>(null)
  const [filter, setFilter] = useState<'all' | 'active' | 'liquidated'>('all')

  const filteredRounds = state.rounds.filter((r) => {
    if (filter === 'all') return true
    return r.status === filter
  })

  return (
    <div className="space-y-6">
      {/* Top Action bar */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
        <div className="flex bg-slate-900 p-1 border border-slate-800 rounded-xl text-xs w-fit">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition font-medium ${
              filter === 'all' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            جميع الجولات ({state.rounds.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1.5 rounded-lg transition font-medium ${
              filter === 'active' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            النشطة حالياً ({state.rounds.filter((r) => r.status === 'active').length})
          </button>
          <button
            onClick={() => setFilter('liquidated')}
            className={`px-3 py-1.5 rounded-lg transition font-medium ${
              filter === 'liquidated' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            المصفاة سلفاً ({state.rounds.filter((r) => r.status === 'liquidated').length})
          </button>
        </div>

        <button
          onClick={() => setIsNewRoundOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition shadow-lg shadow-indigo-600/25 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>إطلاق جولة مضاربة جديدة</span>
        </button>
      </div>

      {/* Rounds List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredRounds.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-500 bg-slate-900/20 border border-slate-800 rounded-2xl">
            لا توجد جولات مطابقة لهذا التصنيف
          </div>
        ) : (
          filteredRounds.map((round) => {
            const roundInvestments = state.investments.filter((inv) => inv.roundId === round.id)
            const currentTotalCapital = roundInvestments.reduce((sum, inv) => sum + inv.totalAmount, 0)
            const progress = Math.min(100, Math.round((round.totalAllocatedShares / round.targetShares) * 100))

            const roundLiquidation = state.liquidations.find((l) => l.roundId === round.id)

            return (
              <div
                key={round.id}
                className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                            round.status === 'active'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {round.status === 'active' ? '● جولة نشطة قيد التجارة' : 'تمت التصفية والإغلاق'}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {round.startDate}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-100 text-lg mt-2">{round.title}</h3>
                      {round.description && (
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{round.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Pricing and Cut Details */}
                  <div className="mt-4 p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl grid grid-cols-3 gap-2 text-center text-xs">
                    <div>
                      <span className="text-slate-400 block">سعر السهم</span>
                      <span className="font-bold text-white mt-0.5 block">${round.shareUnitPrice}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">نسبة المضارب</span>
                      <span className="font-bold text-indigo-400 mt-0.5 block">{round.managerProfitCutPercent}%</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">رأس المال الحالي</span>
                      <span className="font-bold text-emerald-400 mt-0.5 block">${currentTotalCapital.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>الاكتتاب بالأسهم</span>
                      <span className="font-semibold text-slate-200">
                        {round.totalAllocatedShares} / {round.targetShares} سهم ({progress}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* If liquidated, show summary badge */}
                  {roundLiquidation && (
                    <div className="mt-4 p-3 bg-emerald-950/20 border border-emerald-900/30 rounded-xl text-xs space-y-1">
                      <div className="font-semibold text-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        ملخص التصفية الختامية:
                      </div>
                      <div className="flex justify-between text-slate-300 pt-0.5">
                        <span>إجمالي القيمة المصفاة:</span>
                        <span className="font-bold">${roundLiquidation.finalAssetValue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>صافي أرباح الجولة:</span>
                        <span className="font-bold text-emerald-400">+${roundLiquidation.grossProfitOrLoss.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>حصة المضارب (إدارتك):</span>
                        <span className="font-bold text-indigo-400">+${roundLiquidation.managerProfit.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2">
                  {round.status === 'active' ? (
                    <>
                      <button
                        onClick={() => setAllocatingRound(round)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 hover:text-white transition"
                      >
                        <Layers className="w-3.5 h-3.5 text-indigo-400" />
                        اكتتاب أسهم لشريك
                      </button>

                      <button
                        onClick={() => onOpenLiquidation(round)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 hover:text-indigo-200 border border-indigo-500/30 text-xs font-semibold transition"
                      >
                        <Calculator className="w-3.5 h-3.5" />
                        بدء تصفية الجولة
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => onOpenLiquidation(round)}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition"
                    >
                      عرض تقرير التصفية والمقاصة
                    </button>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Modals */}
      <NewRoundModal
        isOpen={isNewRoundOpen}
        onClose={() => setIsNewRoundOpen(false)}
        onSave={onAddRound}
      />

      <AllocateSharesModal
        round={allocatingRound}
        partners={state.partners}
        onClose={() => setAllocatingRound(null)}
        onAllocate={onAllocateShares}
      />
    </div>
  )
}
