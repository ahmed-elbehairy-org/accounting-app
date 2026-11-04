import { useState, useEffect } from 'react'
import type { SettlementPayout } from '../../types'
import { getPartnerNamesMap } from '../../services/partnerNames'

interface Props {
  payouts: Array<Partial<SettlementPayout>>
}

export function LiquidationSettlementTable({ payouts }: Props) {
  const [partnerNames, setPartnerNames] = useState<Record<string, string>>({})

  useEffect(() => {
    getPartnerNamesMap().then(setPartnerNames)
  }, [])

  if (payouts?.length === 0) {
    return <p className="text-xs text-slate-500 text-center py-4">لا توجد تسويات متاحة</p>
  }

  return (
    <div className="border border-slate-800 rounded-xl overflow-hidden">
      <table className="w-full text-right text-xs">
        <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
          <tr>
            <th className="py-2.5 px-3">الشريك</th>
            <th className="py-2.5 px-3">الأسهم</th>
            <th className="py-2.5 px-3">رأس المال العائد</th>
            <th className="py-2.5 px-3">حصة الربح</th>
            <th className="py-2.5 px-3">خصم السلف</th>
            <th className="py-2.5 px-3">الصافي للدفع</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-slate-200">
          {payouts?.map((p, idx) => {
            const displayName = (p.partnerId && partnerNames[p.partnerId]) || p.partnerId || '-'
            return (
              <tr key={p.partnerId || idx} className="hover:bg-slate-800/30">
                <td className="py-2.5 px-3 font-semibold text-slate-100">{displayName}</td>
                <td className="py-2.5 px-3 font-mono text-slate-400">{p.sharesCount}</td>
                <td className="py-2.5 px-3 font-mono text-cyan-300">{Number(p.capitalReturned).toLocaleString()} ج</td>
                <td className="py-2.5 px-3 font-mono text-emerald-400">{Number(p.profitShare).toLocaleString()} ج</td>
                <td className="py-2.5 px-3 font-mono text-rose-400">
                  {Number(p.deductedAdvances || 0) > 0 ? `-${Number(p.deductedAdvances).toLocaleString()} ج` : '-'}
                </td>
                <td className="py-2.5 px-3 font-mono font-bold text-white">{Number(p.netPayable).toLocaleString()} ج</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
