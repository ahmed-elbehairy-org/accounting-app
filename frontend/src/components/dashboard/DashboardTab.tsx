import type { AppState, TradingRound, ShareInvestment } from '../../types/mudharaba'
import { RoundList } from '../rounds/RoundList'

interface Props {
  state: AppState
  onSelectTab: (tab: 'partners' | 'rounds' | 'advances') => void
  onAddRound: (round: Omit<TradingRound, 'id' | 'totalAllocatedShares' | 'status'>) => void
  onAllocateShares: (investment: Omit<ShareInvestment, 'id'>) => void
  onOpenLiquidation: (round: TradingRound) => void
}

export function DashboardTab({ state, onSelectTab, onAddRound, onAllocateShares, onOpenLiquidation }: Props) {
  const activeRounds = state.rounds.filter((r) => r.status === 'active')
  const totalActiveCapital = state.investments
    .filter((inv) => state.rounds.find((r) => r.id === inv.roundId)?.status === 'active')
    .reduce((sum, inv) => sum + inv.totalAmount, 0)

  const totalOpenLoans = state.advances
    .filter((a) => a.status === 'open')
    .reduce((sum, a) => sum + (a.amount - a.settledAmount), 0)

  const totalRealizedProfits = state.liquidations.reduce((sum, l) => sum + l.grossProfitOrLoss, 0)
  const totalManagerProfit = state.liquidations.reduce((sum, l) => sum + l.managerProfit, 0)

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800">
          <span className="text-xs text-slate-400 block font-medium">رأس المال النشط</span>
          <div className="mt-2 text-2xl font-bold text-white tracking-tight">${totalActiveCapital.toLocaleString()}</div>
          <span className="text-xs text-indigo-400 mt-1 block">في {activeRounds.length} جولات نشطة</span>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800">
          <span className="text-xs text-slate-400 block font-medium">سلف ومسحوبات مفتوحة</span>
          <div className="mt-2 text-2xl font-bold text-rose-400 tracking-tight">${totalOpenLoans.toLocaleString()}</div>
          <span className="text-xs text-slate-400 mt-1 block">تخصم تلقائياً عند التصفية</span>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800">
          <span className="text-xs text-slate-400 block font-medium">أرباح مصفاة تاريخياً</span>
          <div className="mt-2 text-2xl font-bold text-emerald-400 tracking-tight">+${totalRealizedProfits.toLocaleString()}</div>
          <span className="text-xs text-slate-400 mt-1 block">من الجولات المكتملة</span>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800">
          <span className="text-xs text-slate-400 block font-medium">صافي حصة المضارب</span>
          <div className="mt-2 text-2xl font-bold text-cyan-400 tracking-tight">+${totalManagerProfit.toLocaleString()}</div>
          <span className="text-xs text-slate-400 mt-1 block">أرباح إدارتك</span>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900/60 to-slate-900/40 border border-indigo-900/40 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-100 text-lg">العمليات السريعة</h3>
          <p className="text-xs text-slate-400 mt-1">سجل حركة جديدة للشركاء أو أصدر سلفة أو جهز تصفية جولة تجارية بنقرة زر.</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button onClick={() => onSelectTab('partners')} className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition">
            كشف حساب شريك
          </button>
          <button onClick={() => onSelectTab('advances')} className="px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-semibold transition">
            صرف سلفة
          </button>
          <button onClick={() => onSelectTab('rounds')} className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition">
            إدارة الجولات والأسهم
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-200">الجولات الاستثمارية</h3>
          <button onClick={() => onSelectTab('rounds')} className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">
            عرض جميع الجولات ←
          </button>
        </div>
        <RoundList state={state} onAddRound={onAddRound} onAllocateShares={onAllocateShares} onOpenLiquidation={onOpenLiquidation} />
      </div>
    </div>
  )
}
