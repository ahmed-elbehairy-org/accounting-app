import { useState, useEffect } from 'react'
import { getPartnerNamesMap } from '../../services/partnerNames'

interface PayoutRow {
  partnerId: string
  partnerName?: string
  shareCount: number
  investorPoolPercent: number
  grossProfitShare: number
  deductedLoan: number
  reinvestedAmount: number
  netCashPayout: number
  payoutMethod: 'cash' | 'reinvest' | 'mixed'
}

interface Props {
  payouts: PayoutRow[]
}

export function DistributionPayoutsTable({ payouts }: Props) {
  const [partnerNames, setPartnerNames] = useState<Record<string, string>>({})

  useEffect(() => {
    getPartnerNamesMap().then(setPartnerNames)
  }, [])

  if (payouts?.length === 0) {
    return <p className="text-xs text-slate-500 text-center py-4">لا توجد تفاصيل صرف متاحة</p>
  }

  return (
    <div className="border border-slate-800 rounded-xl overflow-hidden">
      <table className="w-full text-right text-xs">
        <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
          <tr>
            <th className="py-2.5 px-3">الشريك</th>
            <th className="py-2.5 px-3">الأسهم (%)</th>
            <th className="py-2.5 px-3">الربح الإجمالي</th>
            <th className="py-2.5 px-3">تسوية سلف</th>
            <th className="py-2.5 px-3">إعادة استثمار</th>
            <th className="py-2.5 px-3">الصرف النقدي</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-slate-200">
          {payouts?.map((p) => {
            const displayName = p.partnerName || partnerNames[p.partnerId] || p.partnerId
            return (
              <tr key={p.partnerId} className="hover:bg-slate-800/30">
                <td className="py-2.5 px-3 font-semibold text-slate-100">{displayName}</td>
                <td className="py-2.5 px-3 font-mono text-slate-400">{p.shareCount} ({p.investorPoolPercent}%)</td>
                <td className="py-2.5 px-3 font-bold text-emerald-400">{Number(p.grossProfitShare).toLocaleString()} ج</td>
                <td className="py-2.5 px-3 text-rose-400 font-mono">
                  {p.deductedLoan > 0 ? `-${Number(p.deductedLoan).toLocaleString()} ج` : '-'}
                </td>
                <td className="py-2.5 px-3 text-cyan-400 font-mono">
                  {p.reinvestedAmount > 0 ? `${Number(p.reinvestedAmount).toLocaleString()} ج` : '-'}
                </td>
                <td className="py-2.5 px-3 font-mono font-bold text-white">
                  {Number(p.netCashPayout).toLocaleString()} ج
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
