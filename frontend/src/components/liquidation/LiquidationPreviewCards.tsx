import type { LiquidationCalculation } from "../../types/liquidation";
import {
	Landmark,
	TrendingUp,
	TrendingDown,
	UserCheck,
	Users,
	Percent,
} from "lucide-react";

interface Props {
	calculation: LiquidationCalculation;
}

export function LiquidationPreviewCards({ calculation: c }: Props) {
	const isProfit = c.grossProfitOrLoss >= 0;

	return (
		<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
			<div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
				<div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
					<Landmark className="w-3.5 h-3.5 text-cyan-400" />
					<span>رأس المال المستثمر</span>
				</div>
				<p className="text-sm font-bold text-white">
					{c.initialCapital.toLocaleString()} ج
				</p>
			</div>

			<div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
				<div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
					<Percent className="w-3.5 h-3.5 text-indigo-400" />
					<span>قيمة أصول التصفية</span>
				</div>
				<p className="text-sm font-bold text-indigo-300">
					{c.finalAssetValue.toLocaleString()} ج
				</p>
			</div>

			<div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
				<div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
					{isProfit ? (
						<TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
					) : (
						<TrendingDown className="w-3.5 h-3.5 text-rose-400" />
					)}
					<span>
						{isProfit ? "صافي الربح المحقق" : "صافي الخسارة"}
					</span>
				</div>
				<p
					className={`text-sm font-bold ${isProfit ? "text-emerald-400" : "text-rose-400"}`}
				>
					{isProfit ? "+" : ""}
					{c.grossProfitOrLoss.toLocaleString()} ج
				</p>
			</div>

			<div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
				<div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
					<UserCheck className="w-3.5 h-3.5 text-emerald-400" />
					<span>حصة العامل (المضارب)</span>
				</div>
				<p className="text-sm font-bold text-emerald-300">
					{c.workerProfit.toLocaleString()} ج
				</p>
			</div>

			<div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
				<div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
					<Users className="w-3.5 h-3.5 text-indigo-400" />
					<span>وعاء أرباح الشركاء</span>
				</div>
				<p className="text-sm font-bold text-indigo-300">
					{c.investorsProfitPool.toLocaleString()} ج
				</p>
			</div>

			<div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
				<div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
					<Percent className="w-3.5 h-3.5 text-amber-400" />
					<span>عائد السهم الواحد</span>
				</div>
				<p className="text-sm font-bold text-amber-300">
					{c.returnPerShare.toLocaleString()} ج
				</p>
			</div>
		</div>
	);
}
