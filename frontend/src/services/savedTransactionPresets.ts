const CAT_KEY = 'accounting_saved_categories'
const DESC_KEY = 'accounting_saved_descriptions'

const DEFAULT_CATS = ['مبيعات', 'مشتريات', 'رواتب', 'إيجار', 'مصاريف تشغيل', 'صيانة', 'تسويق']
const DEFAULT_DESCS = ['مبيعات بضاعة', 'دفعة مشتريات موردين', 'مصاريف نقل وشحن', 'سداد فواتير خدمات']

export function getSavedCategories(): string[] {
  try {
    const raw = localStorage.getItem(CAT_KEY)
    if (!raw) return DEFAULT_CATS
    return Array.from(new Set([...JSON.parse(raw), ...DEFAULT_CATS]))
  } catch { return DEFAULT_CATS }
}

export function saveCategory(cat: string) {
  if (!cat || !cat.trim()) return
  const trimmed = cat.trim()
  const list = getSavedCategories()
  if (!list.includes(trimmed)) {
    const updated = [trimmed, ...list].slice(0, 50)
    try { localStorage.setItem(CAT_KEY, JSON.stringify(updated)) } catch {}
  }
}

export function getSavedDescriptions(): string[] {
  try {
    const raw = localStorage.getItem(DESC_KEY)
    if (!raw) return DEFAULT_DESCS
    return Array.from(new Set([...JSON.parse(raw), ...DEFAULT_DESCS]))
  } catch { return DEFAULT_DESCS }
}

export function saveDescription(desc: string) {
  if (!desc || !desc.trim()) return
  const trimmed = desc.trim()
  const list = getSavedDescriptions()
  if (!list.includes(trimmed)) {
    const updated = [trimmed, ...list].slice(0, 50)
    try { localStorage.setItem(DESC_KEY, JSON.stringify(updated)) } catch {}
  }
}

