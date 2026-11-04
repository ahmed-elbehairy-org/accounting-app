import type { PartnerGlobalStats } from '../../types/partner'
import { Users, Coins, HandCoins, PieChart } from 'lucide-react'

interface Props {
  stats: PartnerGlobalStats | null
}

export function PartnerStatsCards({ stats }: Props) {
  const count = stats?.totalCount ?? 0
  const capital = stats?.totalInvestedCapital ?? 0
  const loans = stats?.totalOutstandingLoans ?? 0
  const shares = stats?.totalActiveShares ?? 0

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
          <Users className="w-3.5 h-3.5 text-indigo-400" />
          <span>إجمالي الشركاء</span>
        </div>
        <p className="text-sm font-bold text-white">{count} شريك</p>
      </div>

      <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
          <Coins className="w-3.5 h-3.5 text-emerald-400" />
          <span>رؤوس الأموال المستثمرة</span>
        </div>
        <p className="text-sm font-bold text-emerald-400">{capital.toLocaleString()} ج</p>
      </div>

      <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
          <PieChart className="w-3.5 h-3.5 text-cyan-400" />
          <span>مجموع الأسهم النشطة</span>
        </div>
        <p className="text-sm font-bold text-cyan-300">{shares} سهم</p>
      </div>

      <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
          <HandCoins className="w-3.5 h-3.5 text-rose-400" />
          <span>السلف القائمة غير المسددة</span>
        </div>
        <p className="text-sm font-bold text-rose-400">{loans.toLocaleString()} ج</p>
      </div>
    </div>
  )
}

