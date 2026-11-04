import type { ProfitDistribution, PartnerPayout } from '../../types/distributions'
import { DistributionSummary } from './DistributionSummary'
import { DistributionPayoutsTable } from './DistributionPayoutsTable'
import { DeleteButton } from '../common/DeleteButton'
import { CheckCircle } from 'lucide-react'

interface Props {
  distribution: ProfitDistribution
  payouts?: PartnerPayout[]
  onApprove: (id: string) => void
  onDelete: (id: string) => void
}

export function DistributionCard({ distribution: d, payouts, onApprove, onDelete }: Props) {
  const isApproved = d.status === 'approved'

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono border ${
            isApproved
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
          }`}>
            {isApproved ? 'معتمد ومصروف' : 'مسودة قيد المراجعة'}
          </span>
          <span className="text-xs text-slate-400 font-mono">{d.distributionDate}</span>
        </div>
        <div className="flex items-center gap-2">
          {!isApproved && (
            <button
              onClick={() => onApprove(d.id)}
              className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded-xl transition"
            >
              <CheckCircle className="w-3.5 h-3.5" /> اعتماد وصرف
            </button>
          )}
          <DeleteButton onDelete={() => onDelete(d.id)} />
        </div>
      </div>
      <DistributionSummary
        totalProfit={Number(d.totalProfit)}
        distributedAmount={Number(d.distributedAmount)}
        retainedAmount={Number(d.retainedAmount)}
        workerCut={Number(d.workerCut)}
        investorPool={Number(d.investorPool)}
      />
      {payouts && <DistributionPayoutsTable payouts={payouts} />}
    </div>
  )
}

