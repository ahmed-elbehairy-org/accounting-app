import { LayersPlus, TrendingUp } from 'lucide-react'

import type { Product, ProductCostItem, Project } from '../../types/accounting'

interface Props {
  product: Product
  costItems: ProductCostItem[]
  projects: Project[]
  onOpenAllocateModal: (p: Product) => void
}

export function ProductCostCard({ product, costItems, projects, onOpenAllocateModal }: Props) {
  const pItems = costItems.filter((i) => i.productId === product.id)
  const totalCost = pItems.reduce((s, i) => s + i.allocatedAmount, 0)
  const units = Math.max(1, product.unitsProduced)
  const unitCost = totalCost / units
  const sellingPrice = product.targetSellingPrice
  const profitPerUnit = sellingPrice - unitCost
  const marginPercent = sellingPrice > 0 ? (profitPerUnit / sellingPrice) * 100 : 0
  const project = projects.find((p) => p.id === product.projectId)

  return (
    <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-slate-100 text-sm">{product.name}</h3>
            <span className="text-[10px] text-slate-400 mt-0.5 block">{project?.name} • {product.unitsProduced} عبوة</span>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            {product.sku}
          </span>
        </div>

        <div className="mt-3 p-2.5 bg-slate-950/70 border border-slate-800/80 rounded-xl grid grid-cols-3 gap-2 text-center text-xs">
          <div><span className="text-slate-400 block text-[10px]">إجمالي التكلفة</span><span className="font-bold text-white mt-0.5 block">${totalCost.toLocaleString()}</span></div>
          <div><span className="text-slate-400 block text-[10px]">تكلفة القطعة</span><span className="font-bold text-rose-400 mt-0.5 block">${unitCost.toFixed(2)}</span></div>
          <div><span className="text-slate-400 block text-[10px]">سعر البيع</span><span className="font-bold text-emerald-400 mt-0.5 block">${sellingPrice.toFixed(2)}</span></div>
        </div>

        <div className="mt-2.5 p-2 rounded-xl bg-indigo-950/20 border border-indigo-900/30 flex items-center justify-between text-xs">
          <span className="text-indigo-300 flex items-center gap-1 text-[11px]"><TrendingUp className="w-3.5 h-3.5" />صافي ربح القطعة:</span>
          <span className={`font-bold ${profitPerUnit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            ${profitPerUnit.toFixed(2)} ({marginPercent.toFixed(1)}%)
          </span>
        </div>

        {pItems.length > 0 && (
          <div className="mt-3 space-y-1">
            <span className="text-[10px] text-slate-400 font-semibold block">بنود الصادر المحسوبة:</span>
            {pItems.map((item) => (
              <div key={item.id} className="flex justify-between text-[11px] text-slate-300 bg-slate-950/40 px-2 py-1 rounded">
                <span>{item.costType}</span>
                <span className="font-semibold">${item.allocatedAmount} (${(item.allocatedAmount / units).toFixed(2)}/قطعة)</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => onOpenAllocateModal(product)}
        className="mt-4 w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition"
      >
        <LayersPlus className="w-3.5 h-3.5 text-indigo-400" />
        تخصيص بند صادر جديد للتكلفة
      </button>
    </div>
  )
}
