import { useState } from 'react'
import { Search, CheckCircle, Clock, Plus } from 'lucide-react'
import type { AdvanceLoan, AppState } from '../../types/mudharaba'

import { NewAdvanceModal } from './NewAdvanceModal'

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
  const totalOpenAmount = openAdvances.reduce((sum, a) => sum + (a.amount - a.settledAmount), 0)
  const totalSettledAmount = state.advances
    .filter((a) => a.status === 'settled')
    .reduce((sum, a) => sum + a.amount, 0)

  const filteredAdvances = state.advances.filter((adv) => {
    const partner = state.partners.find((p) => p.id === adv.partnerId)
    const matchesFilter = filter === 'all' ? true : adv.status === filter
    const matchesSearch =
      (partner?.name.toLowerCase() || '').includes(search.toLowerCase()) ||
      adv.reason.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
          <span className="text-xs text-slate-400">إجمالي السلف والمسحوبات القائمة</span>
          <div className="mt-1 text-2xl font-bold text-rose-400">${totalOpenAmount.toLocaleString()}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">تنتظر المقاصة أو السداد</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
          <span className="text-xs text-slate-400">إجمالي المبالغ المسددة والمصفاة</span>
          <div className="mt-1 text-2xl font-bold text-emerald-400">${totalSettledAmount.toLocaleString()}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">تم خصمها في تصفية سابقة</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
          <span className="text-xs text-slate-400">عدد العمليات المسجلة</span>
          <div className="mt-1 text-2xl font-bold text-slate-100">{state.advances.length} عملية</div>
          <span className="text-[11px] text-slate-500 mt-1 block">تحت حساب الأرباح أو رأس المال</span>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="بحث باسم الشريك أو البيان..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pr-9 pl-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex bg-slate-900 p-1 border border-slate-800 rounded-xl text-xs">
            {(['open', 'settled', 'all'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setFilter(mode)}
                className={`px-3 py-1.5 rounded-lg capitalize transition font-medium ${
                  filter === mode
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {mode === 'open' ? 'القائمة فقط' : mode === 'settled' ? 'المسددة' : 'الكل'}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setIsNewOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-sm font-medium rounded-xl transition shadow-lg shadow-rose-600/25 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>تسجيل سلفة / مسحوبات جديدة</span>
        </button>
      </div>

      {/* Table */}
      <div className="border border-slate-800 rounded-2xl bg-slate-900/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3.5">الشريك المستلم</th>
                <th className="p-3.5">المبلغ</th>
                <th className="p-3.5">طبيعة الخصم</th>
                <th className="p-3.5">السبب / الملاحظة</th>
                <th className="p-3.5">تاريخ الصرف</th>
                <th className="p-3.5">الحالة</th>
                <th className="p-3.5 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredAdvances.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 text-sm">
                    لا توجد مسحوبات أو سلف مطابقة
                  </td>
                </tr>
              ) : (
                filteredAdvances.map((adv) => {
                  const partner = state.partners.find((p) => p.id === adv.partnerId)
                  return (
                    <tr key={adv.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-3.5 font-semibold text-slate-100">
                        {partner?.name || 'شريك غير محدد'}
                      </td>
                      <td className="p-3.5 font-bold text-rose-400 text-sm">
                        ${adv.amount.toLocaleString()}
                      </td>
                      <td className="p-3.5 text-slate-300">
                        <span className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-300">
                          {adv.deductionType === 'profit_advance' ? 'تحت حساب الأرباح' : 'سلفة من رأس المال'}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-400 max-w-xs truncate">{adv.reason}</td>
                      <td className="p-3.5 text-slate-400">{adv.date}</td>
                      <td className="p-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                            adv.status === 'open'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          }`}
                        >
                          {adv.status === 'open' ? (
                            <>
                              <Clock className="w-3 h-3" />
                              قائمة
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              تمت التسوية
                            </>
                          )}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        {adv.status === 'open' ? (
                          <button
                            onClick={() => onSettleAdvance(adv.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-[11px] font-medium transition"
                          >
                            تسجيل سداد نقدي
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-500">تمت التسوية</span>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <NewAdvanceModal
        isOpen={isNewOpen}
        partners={state.partners}
        onClose={() => setIsNewOpen(false)}
        onSave={onAddAdvance}
      />
    </div>
  )
}
