import { useState } from 'react'
import { UserPlus, Search } from 'lucide-react'
import type { Partner, AppState } from '../../types/mudharaba'
import { PartnerModal } from './PartnerModal'
import { PartnerStatement } from './PartnerStatement'
import { PartnerCard } from './PartnerCard'

interface Props {
  state: AppState
  onAddPartner: (partner: Omit<Partner, 'id' | 'activeSharesCount' | 'totalInvestedCapital' | 'outstandingLoans'>) => void
}

export function PartnerList({ state, onAddPartner }: Props) {
  const [search, setSearch] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)

  const filtered = state.partners.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.phone.includes(search)
  )

  const totalShares = state.partners.reduce((sum, p) => sum + p.activeSharesCount, 0)
  const totalLoans = state.partners.reduce((sum, p) => sum + p.outstandingLoans, 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
          <span className="text-xs text-slate-400">إجمالي الشركاء</span>
          <div className="mt-1 text-2xl font-bold text-white">{state.partners.length} شريك</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
          <span className="text-xs text-slate-400">إجمالي الأسهم المكتتبة</span>
          <div className="mt-1 text-2xl font-bold text-indigo-400">{totalShares} سهم</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
          <span className="text-xs text-slate-400">إجمالي السلف المعلقة</span>
          <div className="mt-1 text-2xl font-bold text-rose-400">${totalLoans.toLocaleString()}</div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text" placeholder="بحث بالاسم أو الهاتف..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-9 pl-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition shadow-lg shadow-indigo-600/25 shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>إضافة شريك جديد</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-500 bg-slate-900/20 border border-slate-800 rounded-2xl">
            لا يوجد شركاء مسجلين
          </div>
        ) : (
          filtered.map((partner) => (
            <PartnerCard key={partner.id} partner={partner} onOpenStatement={(p) => setSelectedPartner(p)} />
          ))
        )}
      </div>

      <PartnerModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onSave={onAddPartner} />
      <PartnerStatement partner={selectedPartner} state={state} onClose={() => setSelectedPartner(null)} />
    </div>
  )
}
