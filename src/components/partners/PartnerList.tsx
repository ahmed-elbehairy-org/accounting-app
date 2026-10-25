import { useState } from 'react'
import { UserPlus, Search, FileText, Phone, Calendar } from 'lucide-react'
import type { Partner, AppState } from '../../types/mudharaba'

import { PartnerModal } from './PartnerModal'
import { PartnerStatement } from './PartnerStatement'

interface Props {
  state: AppState
  onAddPartner: (partner: Omit<Partner, 'id' | 'activeSharesCount' | 'totalInvestedCapital' | 'outstandingLoans'>) => void
}

export function PartnerList({ state, onAddPartner }: Props) {
  const [search, setSearch] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)

  const filteredPartners = state.partners.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search)
  )

  const totalPartners = state.partners.length
  const totalActiveShares = state.partners.reduce((sum, p) => sum + p.activeSharesCount, 0)
  const totalLoans = state.partners.reduce((sum, p) => sum + p.outstandingLoans, 0)

  return (
    <div className="space-y-6">
      {/* Top Banner KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
          <span className="text-xs text-slate-400">إجمالي الشركاء المسجلين</span>
          <div className="mt-1 text-2xl font-bold text-white">{totalPartners} شريك</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
          <span className="text-xs text-slate-400">إجمالي الأسهم النشطة المكتتبة</span>
          <div className="mt-1 text-2xl font-bold text-indigo-400">{totalActiveShares} سهم</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
          <span className="text-xs text-slate-400">إجمالي السلف والمسحوبات المعلقة</span>
          <div className="mt-1 text-2xl font-bold text-rose-400">${totalLoans.toLocaleString()}</div>
        </div>
      </div>

      {/* Action bar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="بحث بالاسم أو رقم الهاتف..."
            value={search}
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

      {/* Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPartners.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-500 bg-slate-900/20 border border-slate-800 rounded-2xl">
            لا يوجد شركاء مطابقين للبحث
          </div>
        ) : (
          filteredPartners.map((partner) => (
            <div
              key={partner.id}
              className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-100 text-base">{partner.name}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                      {partner.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-500" />
                          {partner.phone}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {partner.joinedDate}
                      </span>
                    </div>
                  </div>
                  <div className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {partner.activeSharesCount} سهم
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block">رأس المال المستثمر</span>
                    <span className="font-bold text-slate-200 mt-0.5 block">
                      ${partner.totalInvestedCapital.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">سلف ومسحوبات</span>
                    <span className={`font-bold mt-0.5 block ${partner.outstandingLoans > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                      ${partner.outstandingLoans.toLocaleString()}
                    </span>
                  </div>
                </div>

                {partner.notes && (
                  <p className="mt-3 text-xs text-slate-400 line-clamp-1 italic bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
                    {partner.notes}
                  </p>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => setSelectedPartner(partner)}
                  className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800/70 hover:bg-slate-800 text-xs font-medium text-slate-200 hover:text-white transition"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  عرض كشف الحساب التفصيلي
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      <PartnerModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSave={onAddPartner}
      />

      <PartnerStatement
        partner={selectedPartner}
        state={state}
        onClose={() => setSelectedPartner(null)}
      />
    </div>
  )
}
