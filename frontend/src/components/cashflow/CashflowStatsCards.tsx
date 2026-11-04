import type { CashflowSummary } from '../../types'
import { ArrowDownLeft, ArrowUpRight, Wallet } from 'lucide-react'

interface Props {
  summary: CashflowSummary | null
}

export function CashflowStatsCards({ summary }: Props) {
  const inflow = summary?.totalInflow ?? 0
  const outflow = summary?.totalOutflow ?? 0
  const net = summary?.netCashflow ?? 0
  const isNetPositive = net >= 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span>إجمالي الوارد (المقبوضات)</span>
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <ArrowDownLeft className="w-4 h-4" />
          </div>
        </div>
        <p className="text-xl font-bold text-emerald-400">{inflow.toLocaleString()} ج</p>
        <span className="text-[11px] text-slate-500 mt-1 block">{summary?.inflowCount ?? 0} عملية وارد</span>
      </div>

      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span>إجمالي الصادر (المصروفات)</span>
          <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
        <p className="text-xl font-bold text-rose-400">{outflow.toLocaleString()} ج</p>
        <span className="text-[11px] text-slate-500 mt-1 block">{summary?.outflowCount ?? 0} عملية صادر</span>
      </div>

      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span>صافي حركة السيولة (الأرباح)</span>
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
        <p className={`text-xl font-bold ${isNetPositive ? 'text-indigo-400' : 'text-rose-400'}`}>
          {net.toLocaleString()} ج
        </p>
        <span className="text-[11px] text-slate-500 mt-1 block">
          {isNetPositive ? 'فائض تشغيلي صافي' : 'عجز تشغيلي'}
        </span>
      </div>
    </div>
  )
}

