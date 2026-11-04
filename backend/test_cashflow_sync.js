require('reflect-metadata')
const { NestFactory } = require('@nestjs/core')
const { AppModule } = require('./dist/app.module')

async function runCashflowSyncTest() {
  console.log('--- بدء اختبار المزامنة التلقائية لدفتر الصادر والوارد (اكتتاب، توزيع، تصفية) ---')
  const app = await NestFactory.create(AppModule, { logger: false })
  const port = 5088
  await app.listen(port)
  const baseUrl = `http://localhost:${port}`

  try {
    // 1. Create project & partner
    console.log('1. إنشاء مشروع مضاربة وشريك لاختبار المزامنة الآلية')
    const project = await (await fetch(`${baseUrl}/api/projects`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'مشروع المزامنة المالية', shareUnitPrice: 1000, workerProfitPercentage: 20 })
    })).json()
    const partner = await (await fetch(`${baseUrl}/api/partners`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'شريك المزامنة' })
    })).json()

    // 2. Allocate shares -> Check auto inflow in cashflow
    console.log('2. تخصيص 20 سهم (20,000 ج) والتحقق من توليد قيد وارد تلقائي')
    await fetch(`${baseUrl}/api/projects/${project.id}/allocate`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ partnerId: partner.id, shareCount: 20 })
    })

    const afterAlloc = await (await fetch(`${baseUrl}/api/cashflow?projectId=${project.id}`)).json()
    const allocEntry = afterAlloc.find((c) => c.category === 'اكتتاب أسهم')
    console.log(`   قيد الاكتتاب: النوع=${allocEntry?.type}، المبلغ=${allocEntry?.amount} ج`)
    if (!allocEntry || allocEntry.type !== 'inflow' || Number(allocEntry.amount) !== 20000) {
      throw new Error('Cashflow auto-inflow for share allocation failed!')
    }

    // 3. Create and approve distribution -> Check auto outflow in cashflow
    console.log('3. اعتماد توزيع أرباح والتحقق من توليد قيود صادر تلقائية للعامل والشريك')
    const { distribution } = await (await fetch(`${baseUrl}/api/distributions`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId: project.id, totalProfit: 10000, distributedAmount: 10000 })
    })).json()
    await fetch(`${baseUrl}/api/distributions/${distribution.id}/approve`, { method: 'POST' })

    const afterDist = await (await fetch(`${baseUrl}/api/cashflow?projectId=${project.id}`)).json()
    const workerOutflow = afterDist.find((c) => c.category === 'توزيع أرباح - عامل')
    const partnerOutflow = afterDist.find((c) => c.category === 'توزيع أرباح - شريك')
    console.log(`   صادر العامل=${workerOutflow?.amount} ج (المتوقع: 2000)، صادر الشريك=${partnerOutflow?.amount} ج (المتوقع: 8000)`)
    if (Number(workerOutflow?.amount) !== 2000 || Number(partnerOutflow?.amount) !== 8000) {
      throw new Error('Cashflow auto-outflow for distribution failed!')
    }

    // 4. Execute final liquidation -> Check auto outflow in cashflow
    console.log('4. تنفيذ التصفية النهائية والتحقق من قيد صادر مستحقات التصفية')
    await fetch(`${baseUrl}/api/liquidations/execute`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId: project.id, finalAssetValue: 25000 })
    })

    const afterLiq = await (await fetch(`${baseUrl}/api/cashflow?projectId=${project.id}`)).json()
    const liqWorker = afterLiq.find((c) => c.category === 'تصفية - حصة عامل')
    const liqPartner = afterLiq.find((c) => c.category === 'تصفية - مستحقات شريك')
    console.log(`   تصفية عامل=${liqWorker?.amount} ج (المتوقع: 1000)، تصفية شريك=${liqPartner?.amount} ج (المتوقع: 24000)`)
    if (Number(liqWorker?.amount) !== 1000 || Number(liqPartner?.amount) !== 24000) {
      throw new Error('Cashflow auto-outflow for liquidation failed!')
    }

    console.log(' نجحت جميع اختبارات الربط المالي والمزامنة التلقائية لدفتر الصادر والوارد 100%')
  } finally {
    await app.close()
  }
}

runCashflowSyncTest().catch((err) => {
  console.error(' فشل الاختبار:', err)
  process.exit(1)
})
