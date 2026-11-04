require("reflect-metadata");
const { NestFactory } = require("@nestjs/core");
const { AppModule } = require("./dist/app.module");

async function runPhase3Test() {
	console.log(
		"--- بدء الاختبار التكاملي التلقائي للمرحلة 3 (وحدة مشاريع المضاربة الشرعية) ---",
	);
	const app = await NestFactory.create(AppModule, { logger: false });
	const port = 5056;
	await app.listen(port);
	const baseUrl = `http://localhost:${port}`;

	try {
		// 1. Create project
		console.log("1. إنشاء مشروع مضاربة (100 سهم، نسبة العامل 20%)");
		const projRes = await fetch(`${baseUrl}/api/projects`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				name: "مشروع تمور الأحساء للمضاربة",
				targetShares: 100,
				shareUnitPrice: 1000,
				workerProfitPercentage: 20,
				workerName: "عبدالرحمن المضارب",
			}),
		});
		const project = await projRes.json();

		// 2. Create two partners
		console.log("2. إنشاء شريكين (أحمد وخالد)");
		const p1Res = await fetch(`${baseUrl}/api/partners`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name: "أحمد التاجر", phone: "0501112222" }),
		});
		const partnerA = await p1Res.json();

		const p2Res = await fetch(`${baseUrl}/api/partners`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				name: "خالد المستثمر",
				phone: "0503334444",
			}),
		});
		const partnerB = await p2Res.json();

		// 3. Allocate shares: 30 to A, 20 to B
		console.log("3. تخصيص 30 سهم للشريك (أحمد) و 20 سهم للشريك (خالد)");
		await fetch(`${baseUrl}/api/projects/${project.id}/allocate`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ partnerId: partnerA.id, shareCount: 30 }),
		});
		await fetch(`${baseUrl}/api/projects/${project.id}/allocate`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ partnerId: partnerB.id, shareCount: 20 }),
		});

		// 4. Query stats and verify calculations
		console.log("4. جلب إحصائيات وتوزيعات المشروع والتحقق الرياضي والشرعي");
		const statsRes = await fetch(
			`${baseUrl}/api/projects/${project.id}/stats`,
		);
		const { stats } = await statsRes.json();

		console.log(
			`   مجموع الأسهم المخصصة: ${stats.totalAllocatedShares} / 100 (نسبة الإنجاز: ${stats.progressPercent}%)`,
		);
		console.log(`   رأس المال المجمع: ${stats.totalCapital} ج`);
		console.log(
			`   نسبة العامل: 20% | حصة وعاء الشركاء: ${stats.remainingInvestorsCut}%`,
		);

		if (stats.totalAllocatedShares !== 50)
			throw new Error("Total allocated shares mismatch!");
		if (stats.progressPercent !== 50)
			throw new Error("Progress percent mismatch!");
		if (stats.totalCapital !== 50000)
			throw new Error("Total capital mismatch!");
		if (stats.remainingInvestorsCut !== 80)
			throw new Error("Remaining investors cut mismatch!");

		const shareA = stats.partnerShares.find(
			(p) => p.partnerId === partnerA.id,
		);
		const shareB = stats.partnerShares.find(
			(p) => p.partnerId === partnerB.id,
		);

		console.log(
			`   الشريك أحمد: ${shareA.shareCount} سهم -> ${shareA.investorPoolPercent}% من المستثمرين -> نسبة ربح فعلية: ${shareA.effectiveProfitSharePercent}%`,
		);
		console.log(
			`   الشريك خالد: ${shareB.shareCount} سهم -> ${shareB.investorPoolPercent}% من المستثمرين -> نسبة ربح فعلية: ${shareB.effectiveProfitSharePercent}%`,
		);

		if (
			shareA.investorPoolPercent !== 60 ||
			shareA.effectiveProfitSharePercent !== 48
		) {
			throw new Error(
				`Partner A calculations invalid: pool=${shareA.investorPoolPercent}, effective=${shareA.effectiveProfitSharePercent}`,
			);
		}
		if (
			shareB.investorPoolPercent !== 40 ||
			shareB.effectiveProfitSharePercent !== 32
		) {
			throw new Error(
				`Partner B calculations invalid: pool=${shareB.investorPoolPercent}, effective=${shareB.effectiveProfitSharePercent}`,
			);
		}

		const totalInvestorProfit =
			shareA.effectiveProfitSharePercent +
			shareB.effectiveProfitSharePercent;
		if (totalInvestorProfit !== 80)
			throw new Error("Investor profit pool sum invalid!");

		console.log(
			" نجحت جميع اختبارات حسابات المضاربة وتوزيع الحصص والربط التكاملي 100%",
		);
	} finally {
		await app.close();
	}
}

runPhase3Test().catch((err) => {
	console.error(" فشل الاختبار:", err);
	process.exit(1);
});
