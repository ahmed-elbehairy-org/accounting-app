import { useState } from 'react'
import { Plus } from 'lucide-react'
import type { TradingRound, ShareInvestment, AppState } from '../../types/mudharaba'
import { NewRoundModal } from './NewRoundModal'
import { AllocateSharesModal } from './AllocateSharesModal'
import { RoundCard } from './RoundCard'

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

  const filtered = state.rounds.filter((r) => (filter === 'all' ? true : r.status === filter))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
        <div className="flex bg-slate-900 p-1 border border-slate-800 rounded-xl text-xs w-fit">
          {(['all', 'active', 'liquidated'] as const).map((tab) => (
            <button
              key={tab} onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg transition font-medium ${filter === tab ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
            >
              {tab === 'all' ? `الكل (${state.rounds.length})` : tab === 'active' ? `النشطة (${state.rounds.filter(r => r.status === 'active').length})` : `المصفاة (${state.rounds.filter(r => r.status === 'liquidated').length})`}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsNewRoundOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition shadow-lg shadow-indigo-600/25 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>إطلاق جولة مضاربة جديدة</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-500 bg-slate-900/20 border border-slate-800 rounded-2xl">
            لا توجد جولات تجارية مسجلة
          </div>
        ) : (
          filtered.map((round) => (
            <RoundCard
              key={round.id} round={round} state={state}
              onAllocate={(r) => setAllocatingRound(r)} onLiquidate={(r) => onOpenLiquidation(r)}
            />
          ))
        )}
      </div>

      <NewRoundModal isOpen={isNewRoundOpen} onClose={() => setIsNewRoundOpen(false)} onSave={onAddRound} />
      <AllocateSharesModal round={allocatingRound} partners={state.partners} onClose={() => setAllocatingRound(null)} onAllocate={onAllocateShares} />
    </div>
  )
}
