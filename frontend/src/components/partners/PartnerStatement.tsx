import { Printer, X, FileText, ShieldAlert } from 'lucide-react'
import type { Partner, AppState } from '../../types/mudharaba'
import { PartnerStatementInvestments } from './PartnerStatementInvestments'
import { PartnerStatementAdvances } from './PartnerStatementAdvances'

interface Props {
  partner: Partner | null
  state: AppState
  onClose: () => void
}

export function PartnerStatement({ partner, state, onClose }: Props) {
  if (!partner) return null

  const pInvs = state.investments.filter((inv) => inv.partnerId === partner.id)
  const pAdvances = state.advances.filter((adv) => adv.partnerId === partner.id)
  const pSettlements = state.settlements.filter((s) => s.partnerId === partner.id)

  const totalInvested = pInvs.reduce((sum, inv) => sum + inv.totalAmount, 0)
  const openAdvances = pAdvances.filter((a) => a.status === 'open').reduce((sum, a) => sum + (a.amount - a.settledAmount), 0)
  const totalProfits = pSettlements.reduce((sum, s) => sum + s.profitShare, 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl my-8 print:m-0 print:border-none print:shadow-none print:bg-white print:text-black">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between print:border-black">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400 print:text-black" />
            <div>
              <h3 className="font-bold text-slate-100 text-base print:text-black">كشف حساب: {partner.name}</h3>
              <p className="text-xs text-slate-400 print:text-gray-600">هاتف: {partner.phone || 'غير مسجل'} • الانضمام: {partner.joinedDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 print:hidden">
            <button onClick={() => window.print()} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition">
              <Printer className="w-4 h-4" />طباعة
            </button>
            <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 print:bg-gray-100 print:border-gray-300">
              <span className="text-[11px] text-slate-400 block">رأس المال</span>
              <span className="text-base font-bold text-slate-100 print:text-black mt-0.5 block">${totalInvested.toLocaleString()}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 print:bg-gray-100 print:border-gray-300">
              <span className="text-[11px] text-slate-400 block">الأسهم النشطة</span>
              <span className="text-base font-bold text-indigo-400 print:text-black mt-0.5 block">{partner.activeSharesCount} سهم</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 print:bg-gray-100 print:border-gray-300">
              <span className="text-[11px] text-slate-400 block">سلف معلقة</span>
              <span className="text-base font-bold text-rose-400 print:text-black mt-0.5 block">${openAdvances.toLocaleString()}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 print:bg-gray-100 print:border-gray-300">
              <span className="text-[11px] text-slate-400 block">أرباح مصفاة</span>
              <span className="text-base font-bold text-emerald-400 print:text-black mt-0.5 block">+${totalProfits.toLocaleString()}</span>
            </div>
          </div>

          {openAdvances > 0 && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>تنبيه: يوجد سلف مفتوحة بقيمة ${openAdvances.toLocaleString()} تخصم عند التصفية.</span>
            </div>
          )}

          <PartnerStatementInvestments investments={pInvs} rounds={state.rounds} />
          <PartnerStatementAdvances advances={pAdvances} />
        </div>
      </div>
    </div>
  )
}
