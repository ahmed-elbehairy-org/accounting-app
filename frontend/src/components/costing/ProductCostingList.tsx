import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import type { Product, ProductCostItem, Project, CashflowItem } from '../../types/accounting'
import { ProductCostCard } from './ProductCostCard'
import { NewProductModal } from './NewProductModal'
import { AllocateCostModal } from './AllocateCostModal'

interface Props {
  products: Product[]
  costItems: ProductCostItem[]
  projects: Project[]
  cashflows: CashflowItem[]
  onAddProduct: (p: Omit<Product, 'id'>) => void
  onAddCostItem: (c: Omit<ProductCostItem, 'id'>) => void
}

export function ProductCostingList({ products, costItems, projects, cashflows, onAddProduct, onAddCostItem }: Props) {
  const [search, setSearch] = useState('')
  const [filterProject, setFilterProject] = useState('')
  const [isNewModalOpen, setIsNewModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const filtered = products.filter((p) => {
    const matchesProj = !filterProject || p.projectId === filterProject
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
    return matchesProj && matchesSearch
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative flex-1 min-w-[160px] max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text" placeholder="بحث باسم المنتج أو الكود..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pr-9 pl-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={filterProject} onChange={(e) => setFilterProject(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none"
          >
            <option value="">جميع المشاريع</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition shadow-lg shadow-indigo-600/25 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة دفعة منتج جديدة</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-500 bg-slate-900/20 border border-slate-800 rounded-2xl">
            لا توجد منتجات مسجلة للتسعير حالياً
          </div>
        ) : (
          filtered.map((prod) => (
            <ProductCostCard
              key={prod.id} product={prod} costItems={costItems} projects={projects}
              onOpenAllocateModal={(p) => setSelectedProduct(p)}
            />
          ))
        )}
      </div>

      <NewProductModal isOpen={isNewModalOpen} projects={projects} onClose={() => setIsNewModalOpen(false)} onSave={onAddProduct} />
      <AllocateCostModal
        product={selectedProduct} cashflows={cashflows}
        onClose={() => setSelectedProduct(null)} onSaveCost={onAddCostItem}
      />
    </div>
  )
}
