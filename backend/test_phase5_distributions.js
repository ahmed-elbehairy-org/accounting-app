require("reflect-metadata");
const { NestFactory } = require("@nestjs/core");
const { AppModule } = require("./dist/app.module");

async function runPhase5Test() {
	console.log(
		"--- بدء الاختبار التكاملي التلقائي للمرحلة 5 (وحدة توزيع الأرباح وتقسيم النسب) ---",
	);
	const app = await NestFactory.create(AppModule, { logger: false });
	const port = 5058;
	await app.listen(port);
	const baseUrl = `http://localhost:${port}`;

	try {
		// 1. Setup project and partners
		console.log(
			"1. إعداد مشروع مضاربة (سعر السهم 1000 ج، حصة العامل 20%) وشريكين (أحمد وخالد)",
		);
		const project = await (
			await fetch(`${baseUrl}/api/projects`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: "مشروع التوزيع التجريبي",
					shareUnitPrice: 1000,
					workerProfitPercentage: 20,
				}),
			})
		).json();

		const partnerA = await (
			await fetch(`${baseUrl}/api/partners`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name: "أحمد شريك أ" }),
			})
		).json();
		const partnerB = await (
			await fetch(`${baseUrl}/api/partners`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name: "خالد شريك ب" }),
			})
		).json();

		// Allocate 30 to A, 20 to B
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

		// 2. Give Partner A a loan of 5,000 SAR
		console.log("2. تسجيل سلفة على الشريك أحمد بقيمة 5,000 ج");
		await fetch(`${baseUrl}/api/advances`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				partnerId: partnerA.id,
				amount: 5000,
				reason: "سلفة أرباح مقدمة",
			}),
		});

		// 3. Create distribution with options: A settles loan, B reinvests 2,000 SAR
		console.log(
			"3. إنشاء جولة توزيع أرباح: 50,000 إجمالي، 40,000 موزع، تسوية سلفة أحمد وإعادة استثمار 2,000 لخالد",
		);
		const distPayload = {
			projectId: project.id,
			totalProfit: 50000,
			distributedAmount: 40000,
			partnerOptions: {
				[partnerA.id]: { settleLoan: true, reinvestAmount: 0 },
				[partnerB.id]: { settleLoan: false, reinvestAmount: 2000 },
			},
		};

		const { distribution, payouts } = await (
			await fetch(`${baseUrl}/api/distributions`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(distPayload),
			})
		).json();

		console.log(
			`   الموزع: ${distribution.distributedAmount} | المبقى: ${distribution.retainedAmount} | حصة العامل (20%): ${distribution.workerCut} | وعاء الشركاء: ${distribution.investorPool}`,
		);
		if (
			distribution.workerCut !== 8000 ||
			distribution.investorPool !== 32000 ||
			distribution.retainedAmount !== 10000
		) {
			throw new Error("Distribution pool calculation error!");
		}

		const payA = payouts.find((p) => p.partnerId === partnerA.id);
		const payB = payouts.find((p) => p.partnerId === partnerB.id);

		console.log(
			`   أحمد: إجمالي=${payA.grossProfitShare}، مخصوم سلف=-${payA.deductedLoan}، صافي نقدي=${payA.netCashPayout}`,
		);
		console.log(
			`   خالد: إجمالي=${payB.grossProfitShare}، معاد استثماره=${payB.reinvestedAmount}، صافي نقدي=${payB.netCashPayout}`,
		);

		if (
			Number(payA.grossProfitShare) !== 19200 ||
			Number(payA.deductedLoan) !== 5000 ||
			Number(payA.netCashPayout) !== 14200
		) {
			throw new Error("Partner A payout math mismatch!");
		}
		if (
			Number(payB.grossProfitShare) !== 12800 ||
			Number(payB.reinvestedAmount) !== 2000 ||
			Number(payB.netCashPayout) !== 10800
		) {
			throw new Error("Partner B payout math mismatch!");
		}

		// 4. Approve distribution and verify mutations
		console.log(
			"4. اعتماد وصرف التوزيع والتحقق من تسوية السلف وإضافة الأسهم الجديدة لخالد",
		);
		await fetch(`${baseUrl}/api/distributions/${distribution.id}/approve`, {
			method: "POST",
		});

		const updatedPartnerA = await (
			await fetch(`${baseUrl}/api/partners/${partnerA.id}`)
		).json();
		const updatedPartnerB = await (
			await fetch(`${baseUrl}/api/partners/${partnerB.id}`)
		).json();
		const updatedProject = await (
			await fetch(`${baseUrl}/api/projects/${project.id}`)
		).json();

		console.log(
			`   سلف أحمد بعد التسوية: ${updatedPartnerA.outstandingLoans} ج (المتوقع: 0)`,
		);
		console.log(
			`   أسهم خالد بعد إعادة الاستثمار: ${updatedPartnerB.activeSharesCount} سهم (المتوقع: 22)`,
		);
		console.log(
			`   إجمالي أسهم المشروع: ${updatedProject.totalAllocatedShares} سهم (المتوقع: 52)`,
		);

		if (Number(updatedPartnerA.outstandingLoans) !== 0)
			throw new Error("Partner A loan not cleared!");
		if (Number(updatedPartnerB.activeSharesCount) !== 22)
			throw new Error("Partner B reinvested shares not added!");
		if (Number(updatedProject.totalAllocatedShares) !== 52)
			throw new Error("Project total shares not updated!");

		console.log(
			" نجحت جميع سيناريوهات توزيع الأرباح وتسوية السلف وإعادة الاستثمار 100%",
		);
	} finally {
		await app.close();
	}
}

runPhase5Test().catch((err) => {
	console.error(" فشل الاختبار:", err);
	process.exit(1);
});
