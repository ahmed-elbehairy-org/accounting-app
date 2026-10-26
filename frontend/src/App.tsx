import { useState } from "react";
import type { TradingRound } from "./types/mudharaba";
import { useMudharabaState } from "./hooks/useMudharabaState";
import { AppHeader } from "./components/layout/AppHeader";
import { AppNavigation, type TabType } from "./components/layout/AppNavigation";
import { DashboardTab } from "./components/dashboard/DashboardTab";
import { PartnerList } from "./components/partners/PartnerList";
import { RoundList } from "./components/rounds/RoundList";
import { AdvancesList } from "./components/advances/AdvancesList";
import { LiquidationHistoryTab } from "./components/liquidation/LiquidationHistoryTab";
import { LiquidationWizard } from "./components/liquidation/LiquidationWizard";

export default function App() {
	const {
		state,
		setState,
		addPartner,
		addRound,
		allocateShares,
		addAdvance,
		settleAdvance,
		resetAllData,
	} = useMudharabaState();
	const [activeTab, setActiveTab] = useState<TabType>("dashboard");
	const [activeLiquidationRound, setActiveLiquidationRound] =
		useState<TradingRound | null>(null);

	return (
		<div
			className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white"
			dir="rtl"
		>
			<AppHeader onReset={resetAllData} />
			<AppNavigation
				activeTab={activeTab}
				onSelectTab={(t) => setActiveTab(t)}
				state={state}
			/>

			<main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
				{activeTab === "dashboard" && (
					<DashboardTab
						state={state}
						onSelectTab={(t) => setActiveTab(t)}
						onAddRound={addRound}
						onAllocateShares={allocateShares}
						onOpenLiquidation={(r) => setActiveLiquidationRound(r)}
					/>
				)}

				{activeTab === "partners" && (
					<PartnerList state={state} onAddPartner={addPartner} />
				)}

				{activeTab === "rounds" && (
					<RoundList
						state={state}
						onAddRound={addRound}
						onAllocateShares={allocateShares}
						onOpenLiquidation={(r) => setActiveLiquidationRound(r)}
					/>
				)}

				{activeTab === "advances" && (
					<AdvancesList
						state={state}
						onAddAdvance={addAdvance}
						onSettleAdvance={settleAdvance}
					/>
				)}

				{activeTab === "liquidations" && (
					<LiquidationHistoryTab
						state={state}
						onGoToRounds={() => setActiveTab("rounds")}
					/>
				)}
			</main>

			<LiquidationWizard
				round={activeLiquidationRound}
				state={state}
				onClose={() => setActiveLiquidationRound(null)}
				onCommitLiquidation={(updated) => setState(updated)}
			/>

			<footer className="border-t border-slate-800/80 py-4 text-center text-xs text-slate-500 print:hidden">
				نظام المضاربة والشراكات التجارية • تم البناء بواسطة React 19 +
				TypeScript + Tailwind CSS v4
			</footer>
		</div>
	);
}
