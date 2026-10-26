import { Phone, Calendar, FileText } from 'lucide-react'
import type { Partner } from '../../types/mudharaba'

interface Props {
  partner: Partner
  onOpenStatement: (p: Partner) => void
}

export function PartnerCard({ partner, onOpenStatement }: Props) {
  return (
    <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-slate-100 text-sm">{partner.name}</h3>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
              {partner.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{partner.phone}</span>}
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{partner.joinedDate}</span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            {partner.activeSharesCount} سهم
          </span>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-slate-400 block">رأس المال</span>
            <span className="font-bold text-slate-200">${partner.totalInvestedCapital.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-slate-400 block">السلف والمسحوبات</span>
            <span className={`font-bold ${partner.outstandingLoans > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
              ${partner.outstandingLoans.toLocaleString()}
            </span>
          </div>
        </div>

        {partner.notes && (
          <p className="mt-2 text-[11px] text-slate-400 italic bg-slate-950/60 p-1.5 rounded-lg border border-slate-800/60 truncate">
            {partner.notes}
          </p>
        )}
      </div>

      <button
        onClick={() => onOpenStatement(partner)}
        className="mt-4 w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition"
      >
        <FileText className="w-3.5 h-3.5 text-indigo-400" />
        كشف الحساب
      </button>
    </div>
  )
}
