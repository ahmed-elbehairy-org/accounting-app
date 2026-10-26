import { CheckCircle2 } from 'lucide-react'
import type { RoundLiquidationSimulation } from '../../utils/mudharabaEngine'

interface Props {
  simulation: RoundLiquidationSimulation | null
  notes: string
  onNotesChange: (notes: string) => void
  onBack: () => void
  onFinalize: () => void
}

export function LiquidationStepReview({ simulation, notes, onNotesChange, onBack, onFinalize }: Props) {
  return (
    <div className="space-y-4">
      <div className="border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-right text-xs">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="p-2.5">الشريك</th>
              <th className="p-2.5">الأسهم</th>
              <th className="p-2.5">رأس المال المسترد</th>
              <th className="p-2.5">الأرباح المستحقة</th>
              <th className="p-2.5">السلف المخصومة</th>
              <th className="p-2.5">صافي المستحق</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {simulation?.partnerPayouts.map((p) => (
              <tr key={p.partner.id} className="hover:bg-slate-800/40">
                <td className="p-2.5 font-semibold text-slate-200">{p.partner.name}</td>
                <td className="p-2.5 text-slate-400">{p.sharesCount} سهم ({p.sharePercentage.toFixed(1)}%)</td>
                <td className="p-2.5 text-slate-300">${p.capitalReturned.toLocaleString()}</td>
                <td className="p-2.5 text-emerald-400 font-bold">+${p.profitEarned.toLocaleString()}</td>
                <td className="p-2.5 text-rose-400 font-semibold">{p.totalAdvances > 0 ? `-$${p.totalAdvances.toLocaleString()}` : '$0'}</td>
                <td className="p-2.5 font-bold text-indigo-400 text-sm">${p.netPayable.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-300 mb-1">ملاحظات التصفية الختامية</label>
        <input
          type="text" value={notes} onChange={(e) => onNotesChange(e.target.value)}
          placeholder="مثال: تم سداد جميع المستحقات نقداً وبشيكات بنكية"
          className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
        />
      </div>

      <div className="flex justify-between items-center pt-2">
        <button type="button" onClick={onBack} className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition">
          الرجوع لتعديل الأصول
        </button>
        <button type="button" onClick={onFinalize} className="inline-flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-emerald-600/30">
          <CheckCircle2 className="w-4 h-4" />
          <span>اعتماد التصفية والمقاصة النهائية</span>
        </button>
      </div>
    </div>
  )
}
