import { RotateCcw } from 'lucide-react'
import { AppLogo } from './AppLogo'

interface Props {
  onReset: () => void
}

export function AppHeader({ onReset }: Props) {
  return (
    <header className="border-b border-slate-800/80 bg-slate-900/70 backdrop-blur sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AppLogo className="w-10 h-10" />
          <div>
            <h1 className="text-base font-bold text-white tracking-tight leading-none">
              منظومة إدارة المضاربة والشراكات
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              إدارة الأسهم • السلف والمسحوبات • المقاصة وتوزيع الأرباح
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onReset}
            title="تفريغ كل البيانات للبدء من الصفر"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs transition border border-slate-700/50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">تفريغ البيانات</span>
          </button>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            نظام فارغ جاهز للتجربة
          </span>
        </div>
      </div>
    </header>
  )
}
