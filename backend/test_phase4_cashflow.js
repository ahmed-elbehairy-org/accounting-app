require("reflect-metadata");
const { NestFactory } = require("@nestjs/core");
const { AppModule } = require("./dist/app.module");

async function runPhase4Test() {
	console.log(
		"--- بدء الاختبار التكاملي التلقائي للمرحلة 4 (دفتر الأستاذ: الصادر والوارد) ---",
	);
	const app = await NestFactory.create(AppModule, { logger: false });
	const port = 5057;
	await app.listen(port);
	const baseUrl = `http://localhost:${port}`;

	try {
		// 1. Create project
		console.log("1. إنشاء مشروع لاختبار الصادر والوارد");
		const projRes = await fetch(`${baseUrl}/api/projects`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name: "مشروع تجارة التمور الموسمية" }),
		});
		const project = await projRes.json();

		// 2. Insert Inflows & Outflows
		console.log(
			"2. إدراج حركات وارد (50,000 + 25,000) وحركات صادر (20,000 + 5,000)",
		);
		await fetch(`${baseUrl}/api/cashflow`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				projectId: project.id,
				type: "inflow",
				category: "مبيعات جملة",
				amount: 50000,
			}),
		});
		await fetch(`${baseUrl}/api/cashflow`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				projectId: project.id,
				type: "inflow",
				category: "إيراد تشغيلي",
				amount: 25000,
			}),
		});
		const out1Res = await fetch(`${baseUrl}/api/cashflow`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				projectId: project.id,
				type: "outflow",
				category: "شراء بضاعة",
				amount: 20000,
			}),
		});
		const out1 = await out1Res.json();
		const out2Res = await fetch(`${baseUrl}/api/cashflow`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				projectId: project.id,
				type: "outflow",
				category: "تكاليف شحن",
				amount: 5000,
			}),
		});
		const out2 = await out2Res.json();

		// 3. Compare API Summary with Frontend Calculation
		console.log(
			"3. التحقق الرياضي ومطابقة الحسابات بين الخادم والواجهة الأمامية",
		);
		const summary = await (
			await fetch(
				`${baseUrl}/api/cashflow/summary?projectId=${project.id}`,
			)
		).json();
		const items = await (
			await fetch(`${baseUrl}/api/cashflow?projectId=${project.id}`)
		).json();

		const uiInflow = items
			.filter((x) => x.type === "inflow")
			.reduce((s, x) => s + Number(x.amount), 0);
		const uiOutflow = items
			.filter((x) => x.type === "outflow")
			.reduce((s, x) => s + Number(x.amount), 0);
		const uiNet = uiInflow - uiOutflow;

		console.log(
			`   الخادم: وارد=${summary.totalInflow}، صادر=${summary.totalOutflow}، صافي=${summary.netCashflow}`,
		);
		console.log(
			`   الواجهة: وارد=${uiInflow}، صادر=${uiOutflow}، صافي=${uiNet}`,
		);

		if (
			summary.totalInflow !== 75000 ||
			summary.totalOutflow !== 25000 ||
			summary.netCashflow !== 50000
		) {
			throw new Error("API Summary values mismatch!");
		}
		if (
			uiInflow !== summary.totalInflow ||
			uiOutflow !== summary.totalOutflow ||
			uiNet !== summary.netCashflow
		) {
			throw new Error("Frontend calculation parity failed!");
		}

		// 4. Test Soft Delete on Outflow
		console.log(
			"4. التحقق من الحذف المؤقت لأحد المصاريف (5,000 ج) وإعادة احتساب الصافي تلقائياً",
		);
		await fetch(`${baseUrl}/api/cashflow/${out2.id}`, { method: "DELETE" });
		const summaryAfterDel = await (
			await fetch(
				`${baseUrl}/api/cashflow/summary?projectId=${project.id}`,
			)
		).json();
		console.log(
			`   الصافي بعد حذف المصروف: ${summaryAfterDel.netCashflow} ج (المتوقع: 55,000 ج)`,
		);
		if (
			summaryAfterDel.netCashflow !== 55000 ||
			summaryAfterDel.totalOutflow !== 20000
		) {
			throw new Error("Summary did not exclude soft-deleted outflow!");
		}

		// 5. Restore Outflow
		console.log("5. استعادة المصروف والتحقق من رجوع الصافي إلى 50,000 ج");
		await fetch(`${baseUrl}/api/cashflow/${out2.id}/restore`, {
			method: "PATCH",
		});
		const summaryAfterRestore = await (
			await fetch(
				`${baseUrl}/api/cashflow/summary?projectId=${project.id}`,
			)
		).json();
		if (summaryAfterRestore.netCashflow !== 50000) {
			throw new Error("Summary restore parity failed!");
		}

		console.log(
			" نجحت جميع اختبارات الصادر والوارد وتطابق الخادم والواجهة 100%",
		);
	} finally {
		await app.close();
	}
}

runPhase4Test().catch((err) => {
	console.error(" فشل الاختبار:", err);
	process.exit(1);
});
