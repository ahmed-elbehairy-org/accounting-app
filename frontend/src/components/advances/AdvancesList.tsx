import { useState } from 'react'
import { Search, Plus } from 'lucide-react'
import type { AdvanceLoan, AppState } from '../../types/mudharaba'
import { NewAdvanceModal } from './NewAdvanceModal'
import { AdvancesTable } from './AdvancesTable'

interface Props {
  state: AppState
  onAddAdvance: (advance: Omit<AdvanceLoan, 'id' | 'status' | 'settledAmount'>) => void
  onSettleAdvance: (advanceId: string) => void
}

export function AdvancesList({ state, onAddAdvance, onSettleAdvance }: Props) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'open' | 'settled'>('open')
  const [isNewOpen, setIsNewOpen] = useState(false)

  const openAdvances = state.advances.filter((a) => a.status === 'open')
  const totalOpen = openAdvances.reduce((sum, a) => sum + (a.amount - a.settledAmount), 0)
  const totalSettled = state.advances.filter((a) => a.status === 'settled').reduce((sum, a) => sum + a.amount, 0)

  const filtered = state.advances.filter((adv) => {
    const partner = state.partners.find((p) => p.id === adv.partnerId)
    const matchesFilter = filter === 'all' ? true : adv.status === filter
    const matchesSearch = (partner?.name || '').toLowerCase().includes(search.toLowerCase()) || adv.reason.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
          <span className="text-xs text-slate-400">إجمالي السلف القائمة</span>
          <div className="mt-1 text-2xl font-bold text-rose-400">${totalOpen.toLocaleString()}</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
          <span className="text-xs text-slate-400">إجمالي المبالغ المسددة</span>
          <div className="mt-1 text-2xl font-bold text-emerald-400">${totalSettled.toLocaleString()}</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
          <span className="text-xs text-slate-400">عدد العمليات</span>
          <div className="mt-1 text-2xl font-bold text-slate-100">{state.advances.length} عملية</div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text" placeholder="بحث باسم الشريك..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pr-9 pl-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex bg-slate-900 p-1 border border-slate-800 rounded-xl text-xs">
            {(['open', 'settled', 'all'] as const).map((m) => (
              <button
                key={m} onClick={() => setFilter(m)}
                className={`px-3 py-1.5 rounded-lg transition font-medium ${filter === m ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
              >
                {m === 'open' ? 'القائمة' : m === 'settled' ? 'المسددة' : 'الكل'}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setIsNewOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-sm font-medium rounded-xl transition shadow-lg shadow-rose-600/25 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>سلفة جديدة</span>
        </button>
      </div>

      <div className="border border-slate-800 rounded-2xl bg-slate-900/30 overflow-hidden">
        <AdvancesTable advances={filtered} partners={state.partners} onSettle={onSettleAdvance} />
      </div>

      <NewAdvanceModal isOpen={isNewOpen} partners={state.partners} onClose={() => setIsNewOpen(false)} onSave={onAddAdvance} />
    </div>
  )
}
