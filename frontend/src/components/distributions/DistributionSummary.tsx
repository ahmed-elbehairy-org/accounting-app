import { Coins, UserCheck, Users, PiggyBank, Scale } from "lucide-react";

interface Props {
	totalProfit: number;
	distributedAmount: number;
	retainedAmount: number;
	workerCut: number;
	investorPool: number;
}

export function DistributionSummary({
	totalProfit,
	distributedAmount,
	retainedAmount,
	workerCut,
	investorPool,
}: Props) {
	return (
		<div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
			<div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
				<div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
					<Coins className="w-3.5 h-3.5 text-amber-400" />
					<span>إجمالي الربح</span>
				</div>
				<p className="text-sm font-bold text-white">
					{totalProfit.toLocaleString()} ج
				</p>
			</div>

			<div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
				<div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
					<Scale className="w-3.5 h-3.5 text-indigo-400" />
					<span>المبلغ الموزع</span>
				</div>
				<p className="text-sm font-bold text-indigo-300">
					{distributedAmount.toLocaleString()} ج
				</p>
			</div>

			<div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
				<div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
					<PiggyBank className="w-3.5 h-3.5 text-cyan-400" />
					<span>المبقى كاحتياطي</span>
				</div>
				<p className="text-sm font-bold text-cyan-300">
					{retainedAmount.toLocaleString()} ج
				</p>
			</div>

			<div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
				<div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
					<UserCheck className="w-3.5 h-3.5 text-emerald-400" />
					<span>حصة العامل</span>
				</div>
				<p className="text-sm font-bold text-emerald-400">
					{workerCut.toLocaleString()} ج
				</p>
			</div>

			<div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
				<div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
					<Users className="w-3.5 h-3.5 text-indigo-400" />
					<span>وعاء الشركاء</span>
				</div>
				<p className="text-sm font-bold text-indigo-400">
					{investorPool.toLocaleString()} ج
				</p>
			</div>
		</div>
	);
}
