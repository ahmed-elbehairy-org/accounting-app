import { Trash2 } from 'lucide-react'

interface Props {
  onDelete: () => void
  title?: string
  className?: string
}

export function DeleteButton({ onDelete, title = 'حذف مؤقت', className = '' }: Props) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onDelete()
      }}
      title={title}
      className={`p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition ${className}`}
    >
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  )
}

