import type { Project, CashflowItem, Partner } from '../types'
import type { DeletedRecord } from '../components/trash/TrashTab'

export function buildTrashRecords(
  projects: Project[],
  cashflows: CashflowItem[],
  partners: Partner[]
): DeletedRecord[] {
  return [
    ...(projects || []).map((p) => ({
      id: p.id,
      category: 'projects' as const,
      categoryLabel: 'مشروع مضاربة',
      title: p.name,
      deletedAt: p.deletedAt
    })),
    ...(cashflows || []).map((c) => ({
      id: c.id,
      category: 'cashflows' as const,
      categoryLabel: `حركة ${c.type === 'inflow' ? 'وارد' : 'صادر'} (${c.category})`,
      title: `${Number(c.amount).toLocaleString()} ج - ${c.description || c.category}`,
      deletedAt: c.deletedAt
    })),
    ...(partners || []).map((pt) => ({
      id: pt.id,
      category: 'partners' as const,
      categoryLabel: 'شريك مستثمر',
      title: pt.name,
      deletedAt: pt.deletedAt
    }))
  ]
}

