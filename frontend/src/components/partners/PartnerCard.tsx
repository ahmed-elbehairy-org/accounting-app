import type { Partner } from '../../types'
import { DeleteButton } from '../common/DeleteButton'
import { FileText, HandCoins, Phone, Calendar, Edit2 } from 'lucide-react'

interface Props {
  partner: Partner
  onViewStatement: (partner: Partner) => void
  onIssueAdvance: (partner: Partner) => void
  onEdit: (partner: Partner) => void
  onDelete: (id: string) => void
}

export function PartnerCard({ partner, onViewStatement, onIssueAdvance, onEdit, onDelete }: Props) {
  const shares = partner.activeSharesCount || 0
  const capital = partner.totalInvestedCapital || 0
  const loans = partner.outstandingLoans || 0

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
            شريك مساهم
          </span>
          <div className="flex items-center gap-1">
            <button onClick={() => onEdit(partner)} className="p-1 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-slate-800 transition" title="تعديل بيانات الشريك">
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <DeleteButton onDelete={() => onDelete(partner.id)} />
          </div>
        </div>
        <h3 className="font-bold text-slate-100 text-sm">{partner.name}</h3>
        <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
          {partner.phone && (
            <span className="flex items-center gap-1 font-mono"><Phone className="w-3 h-3" /> {partner.phone}</span>
          )}
          <span className="flex items-center gap-1 font-mono"><Calendar className="w-3 h-3" /> {partner.joinedDate}</span>
        </div>
      </div>

      <div className="my-4 grid grid-cols-3 gap-2 text-[11px]">
        <div className="bg-slate-950/60 p-2 rounded-xl text-center">
          <span className="text-slate-500 block">الأسهم</span>
          <span className="font-bold text-cyan-300">{shares}</span>
        </div>
        <div className="bg-slate-950/60 p-2 rounded-xl text-center">
          <span className="text-slate-500 block">رأس المال</span>
          <span className="font-bold text-emerald-400">{Number(capital).toLocaleString()} ج</span>
        </div>
        <div className="bg-slate-950/60 p-2 rounded-xl text-center">
          <span className="text-slate-500 block">السلف</span>
          <span className={`font-bold ${loans > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
            {Number(loans).toLocaleString()} ج
          </span>
        </div>
      </div>

      <div className="flex gap-2 pt-2 border-t border-slate-800/80">
        <button
          onClick={() => onViewStatement(partner)}
          className="flex-1 py-1.5 px-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs rounded-xl flex items-center justify-center gap-1 transition"
        >
          <FileText className="w-3.5 h-3.5" /> كشف الحساب
        </button>
        <button
          onClick={() => onIssueAdvance(partner)}
          className="flex-1 py-1.5 px-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 text-xs rounded-xl flex items-center justify-center gap-1 transition"
        >
          <HandCoins className="w-3.5 h-3.5" /> صرف سلفة
        </button>
      </div>
    </div>
  )
}
