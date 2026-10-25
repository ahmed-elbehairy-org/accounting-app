import { useState } from 'react'
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  DollarSign,
  PlusCircle,
  Receipt,
  Search,
  Wallet
} from 'lucide-react'

interface Transaction {
  id: string
  title: string
  category: string
  amount: number
  type: 'income' | 'expense'
  date: string
  status: 'completed' | 'pending'
}

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    title: 'Client Payment - Project Alpha',
    category: 'Consulting',
    amount: 8500,
    type: 'income',
    date: '2026-10-24',
    status: 'completed'
  },
  {
    id: 'tx-2',
    title: 'Cloud Infrastructure Services',
    category: 'Operations',
    amount: 1240,
    type: 'expense',
    date: '2026-10-23',
    status: 'completed'
  },
  {
    id: 'tx-3',
    title: 'Software Licensing Renewal',
    category: 'Software',
    amount: 450,
    type: 'expense',
    date: '2026-10-22',
    status: 'pending'
  },
  {
    id: 'tx-4',
    title: 'Design Retainer Payment',
    category: 'Design',
    amount: 3200,
    type: 'income',
    date: '2026-10-20',
    status: 'completed'
  }
]

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS)
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all')
  const [search, setSearch] = useState('')

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0)

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0)

  const netBalance = totalIncome - totalExpense

  const filteredTransactions = transactions.filter((t) => {
    const matchesFilter = filter === 'all' ? true : t.type === filter
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const addQuickInvoice = () => {
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      title: 'New Service Invoice',
      category: 'General',
      amount: Math.floor(Math.random() * 2000) + 500,
      type: 'income',
      date: new Date().toISOString().split('T')[0],
      status: 'completed'
    }
    setTransactions([newTx, ...transactions])
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Receipt className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-semibold tracking-tight text-white leading-none">
                Accounting Starter
              </h1>
              <p className="text-xs text-slate-400 mt-1">Vite + React + Tailwind v4 + TS</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Starter
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 shadow-sm hover:border-slate-700 transition">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Total Balance</span>
              <Wallet className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="mt-3 text-2xl font-bold tracking-tight text-white">
              ${netBalance.toLocaleString()}
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Real-time calculated
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 shadow-sm hover:border-slate-700 transition">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Total Inflow</span>
              <ArrowUpRight className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-3 text-2xl font-bold tracking-tight text-emerald-400">
              +${totalIncome.toLocaleString()}
            </div>
            <p className="text-xs text-slate-400 mt-1">From incoming payments</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 shadow-sm hover:border-slate-700 transition">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Total Outflow</span>
              <ArrowDownRight className="w-4 h-4 text-rose-400" />
            </div>
            <div className="mt-3 text-2xl font-bold tracking-tight text-rose-400">
              -${totalExpense.toLocaleString()}
            </div>
            <p className="text-xs text-slate-400 mt-1">Operational overhead</p>
          </div>
        </div>

        {/* Action & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-56 transition"
              />
            </div>

            <div className="flex bg-slate-900 p-1 border border-slate-800 rounded-xl text-xs">
              {(['all', 'income', 'expense'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setFilter(mode)}
                  className={`px-3 py-1.5 rounded-lg capitalize transition font-medium ${
                    filter === mode
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={addQuickInvoice}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition shadow-lg shadow-indigo-600/25 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Invoice</span>
          </button>
        </div>

        {/* Transactions Table / List */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/30 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              Recent Records ({filteredTransactions.length})
            </h2>
            <span className="text-xs text-slate-500">Auto-sorted by date</span>
          </div>

          <div className="divide-y divide-slate-800/60">
            {filteredTransactions.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                No matching transactions found.
              </div>
            ) : (
              filteredTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="px-6 py-4 flex items-center justify-between hover:bg-slate-900/50 transition"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-semibold ${
                        tx.type === 'income'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-200">{tx.title}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>{tx.category}</span>
                        <span>•</span>
                        <span>{tx.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-sm font-semibold ${
                        tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
                    </div>
                    <span
                      className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider ${
                        tx.status === 'completed'
                          ? 'bg-slate-800 text-slate-300'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-800/80 py-4 text-center text-xs text-slate-500">
        Initialized with Vite • React 19 • TypeScript • Tailwind CSS v4
      </footer>
    </div>
  )
}
