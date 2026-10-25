import { Printer, X, FileText, ShieldAlert } from 'lucide-react'
import type { Partner, AppState } from '../../types/mudharaba'

interface Props {
  partner: Partner | null
  state: AppState
  onClose: () => void
}

export function PartnerStatement({ partner, state, onClose }: Props) {
  if (!partner) return null

  const partnerInvestments = state.investments.filter((inv) => inv.partnerId === partner.id)
  const partnerAdvances = state.advances.filter((adv) => adv.partnerId === partner.id)
  const partnerSettlements = state.settlements.filter((s) => s.partnerId === partner.id)

  const totalInvested = partnerInvestments.reduce((sum, inv) => sum + inv.totalAmount, 0)
  const openAdvances = partnerAdvances
    .filter((adv) => adv.status === 'open')
    .reduce((sum, adv) => sum + (adv.amount - adv.settledAmount), 0)

  const totalProfitsEarned = partnerSettlements.reduce((sum, s) => sum + s.profitShare, 0)

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl my-8 print:m-0 print:border-none print:shadow-none print:bg-white print:text-black">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between print:border-black">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400 print:text-black" />
            <div>
              <h3 className="font-bold text-slate-100 text-lg print:text-black">
                كشف حساب شريك: {partner.name}
              </h3>
              <p className="text-xs text-slate-400 print:text-gray-600">
                هاتف: {partner.phone || 'غير مسجل'} • تاريخ الانضمام: {partner.joinedDate}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
            >
              <Printer className="w-4 h-4" />
              طباعة كشف الحساب
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Summary KPI Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 print:bg-gray-100 print:border-gray-300">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">إجمالي رأس المال</span>
              <span className="text-lg font-bold text-slate-100 print:text-black mt-1 block">
                ${totalInvested.toLocaleString()}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 print:bg-gray-100 print:border-gray-300">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">الأسهم النشطة</span>
              <span className="text-lg font-bold text-indigo-400 print:text-black mt-1 block">
                {partner.activeSharesCount} سهم
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 print:bg-gray-100 print:border-gray-300">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">سلف ومسحوبات قائمة</span>
              <span className="text-lg font-bold text-rose-400 print:text-black mt-1 block">
                ${openAdvances.toLocaleString()}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 print:bg-gray-100 print:border-gray-300">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">أرباح مصفاة تاريخياً</span>
              <span className="text-lg font-bold text-emerald-400 print:text-black mt-1 block">
                +${totalProfitsEarned.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Alert if open advance is high */}
          {openAdvances > 0 && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>
                تنبيه: يوجد سلف ومسحوبات مفتوحة بقيمة ${openAdvances.toLocaleString()} سيتم خصمها تلقائياً عند تصفية الجولة الجارية.
              </span>
            </div>
          )}

          {/* Section: Active & Past Investments */}
          <div>
            <h4 className="text-sm font-semibold text-slate-300 mb-3 print:text-black">
              سجل المساهمات والأسهم في الجولات
            </h4>
            <div className="border border-slate-800 rounded-xl overflow-hidden print:border-black">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 print:bg-gray-200 print:text-black">
                  <tr>
                    <th className="p-3">الجولة التجارية</th>
                    <th className="p-3">التاريخ</th>
                    <th className="p-3">عدد الأسهم</th>
                    <th className="p-3">سعر السهم</th>
                    <th className="p-3">إجمالي المساهمة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 print:divide-gray-300">
                  {partnerInvestments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-slate-500">لا توجد مساهمات مسجلة</td>
                    </tr>
                  ) : (
                    partnerInvestments.map((inv) => {
                      const round = state.rounds.find((r) => r.id === inv.roundId)
                      return (
                        <tr key={inv.id} className="hover:bg-slate-800/40">
                          <td className="p-3 font-medium text-slate-200 print:text-black">
                            {round?.title || inv.roundId}
                          </td>
                          <td className="p-3 text-slate-400 print:text-gray-700">{inv.date}</td>
                          <td className="p-3 text-indigo-400 font-semibold print:text-black">{inv.shareCount}</td>
                          <td className="p-3 text-slate-400 print:text-gray-700">${inv.shareUnitPrice}</td>
                          <td className="p-3 font-bold text-slate-100 print:text-black">${inv.totalAmount.toLocaleString()}</td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section: Advances / Personal Loans */}
          <div>
            <h4 className="text-sm font-semibold text-slate-300 mb-3 print:text-black">
              سجل السلف والمسحوبات الشخصية
            </h4>
            <div className="border border-slate-800 rounded-xl overflow-hidden print:border-black">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 print:bg-gray-200 print:text-black">
                  <tr>
                    <th className="p-3">التاريخ</th>
                    <th className="p-3">المبلغ</th>
                    <th className="p-3">نوع الخصم</th>
                    <th className="p-3">السبب / البيان</th>
                    <th className="p-3">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 print:divide-gray-300">
                  {partnerAdvances.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-slate-500">لا توجد سلف أو مسحوبات مسجلة</td>
                    </tr>
                  ) : (
                    partnerAdvances.map((adv) => (
                      <tr key={adv.id} className="hover:bg-slate-800/40">
                        <td className="p-3 text-slate-400 print:text-gray-700">{adv.date}</td>
                        <td className="p-3 font-bold text-rose-400 print:text-black">
                          ${adv.amount.toLocaleString()}
                        </td>
                        <td className="p-3 text-slate-300 print:text-gray-700">
                          {adv.deductionType === 'profit_advance' ? 'تحت حساب الأرباح' : 'خصم من رأس المال'}
                        </td>
                        <td className="p-3 text-slate-400 print:text-gray-700">{adv.reason}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                              adv.status === 'open'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            }`}
                          >
                            {adv.status === 'open' ? 'قائمة (غير مسددة)' : 'تمت التسوية'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section: Settlements / Liquidations received */}
          {partnerSettlements.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-slate-300 mb-3 print:text-black">
                سجل التصفية وصافي المستحقات المستلمة
              </h4>
              <div className="border border-slate-800 rounded-xl overflow-hidden print:border-black">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 print:bg-gray-200 print:text-black">
                    <tr>
                      <th className="p-3">الجولة المصفاة</th>
                      <th className="p-3">رأس المال المسترد</th>
                      <th className="p-3">حصة الأرباح</th>
                      <th className="p-3">المسحوبات المخصومة</th>
                      <th className="p-3">الصافي المنصرف</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 print:divide-gray-300">
                    {partnerSettlements.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-800/40">
                        <td className="p-3 font-medium text-slate-200 print:text-black">{s.roundId}</td>
                        <td className="p-3 text-slate-300 print:text-gray-700">${s.capitalReturned.toLocaleString()}</td>
                        <td className="p-3 text-emerald-400 font-bold print:text-black">+${s.profitShare.toLocaleString()}</td>
                        <td className="p-3 text-rose-400 print:text-black">-${s.deductedAdvances.toLocaleString()}</td>
                        <td className="p-3 font-bold text-indigo-400 print:text-black">${s.netPayable.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
