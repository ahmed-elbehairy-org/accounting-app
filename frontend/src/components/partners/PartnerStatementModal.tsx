import { useState, useEffect } from 'react'
import { apiClient } from '../../services/apiClient'
import type { Partner } from '../../types'
import type { PartnerStatementData } from '../../types/partner'
import { X, FileSpreadsheet, Briefcase, HandCoins } from 'lucide-react'

interface Props {
  partner: Partner | null
  onClose: () => void
}

export function PartnerStatementModal({ partner, onClose }: Props) {
  const [data, setData] = useState<PartnerStatementData | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (partner) {
      setLoading(true)
      apiClient.get<PartnerStatementData>(`/api/partners/${partner.id}/statement`)
        .then((res) => setData(res))
        .finally(() => setLoading(false))
    }
  }, [partner])

  if (!partner) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" dir="rtl">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white">كشف حساب الشريك: {partner.name}</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        {loading ? <div className="text-center py-10 text-xs text-slate-500">جاري تحميل كشف الحساب...</div> : data && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-center">
              <div><span className="text-slate-500 block">إجمالي رأس المال</span><span className="font-bold text-emerald-400">{data.summary.totalInvestedCapital.toLocaleString()} ج</span></div>
              <div><span className="text-slate-500 block">الأسهم النشطة</span><span className="font-bold text-cyan-300">{data.summary.activeSharesCount}</span></div>
              <div><span className="text-slate-500 block">السلف القائمة</span><span className="font-bold text-rose-400">{data.summary.outstandingLoans.toLocaleString()} ج</span></div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 mb-2"><Briefcase className="w-4 h-4 text-indigo-400" /> المساهمات في المشاريع ({data.investments?.length || 0})</h3>
              <div className="border border-slate-800 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-right"><thead className="bg-slate-950 text-slate-400 border-b border-slate-800"><tr><th className="p-2">المشروع</th><th className="p-2">الأسهم</th><th className="p-2">المبلغ</th><th className="p-2">التاريخ</th></tr></thead>
                  <tbody className="divide-y divide-slate-800 text-slate-200">
                    {data.investments?.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-800/30"><td className="p-2 font-medium">{inv.projectName}</td><td className="p-2 font-mono">{inv.shareCount}</td><td className="p-2 font-mono text-emerald-400">{Number(inv.totalAmount).toLocaleString()} ج</td><td className="p-2 text-slate-400">{inv.date}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 mb-2"><HandCoins className="w-4 h-4 text-rose-400" /> سجل السلف والمسحوبات ({data.loans?.length || 0})</h3>
              <div className="border border-slate-800 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-right"><thead className="bg-slate-950 text-slate-400 border-b border-slate-800"><tr><th className="p-2">المبلغ</th><th className="p-2">السبب</th><th className="p-2">الحالة</th><th className="p-2">التاريخ</th></tr></thead>
                  <tbody className="divide-y divide-slate-800 text-slate-200">
                    {data.loans?.map((loan) => (
                      <tr key={loan.id} className="hover:bg-slate-800/30"><td className="p-2 font-bold font-mono text-rose-400">{Number(loan.amount).toLocaleString()} ج</td><td className="p-2">{loan.reason || '-'}</td><td className="p-2"><span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">{loan.status}</span></td><td className="p-2 text-slate-400">{loan.date}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

