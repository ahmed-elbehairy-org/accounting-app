require('reflect-metadata')
const { NestFactory } = require('@nestjs/core')
const { AppModule } = require('./dist/app.module')

async function runPhase6Test() {
  console.log('--- بدء الاختبار التكاملي التلقائي للمرحلة 6 (محرك التصفية النهائية: ربح وخسارة) ---')
  const app = await NestFactory.create(AppModule, { logger: false })
  const port = 5059
  await app.listen(port)
  const baseUrl = `http://localhost:${port}`

  try {
    // 1. Case A: Profit Liquidation
    console.log('1. اختبار حالة الربح (رأس مال 50,000، أصول 70,000 -> ربح 20,000 مع خصم سلفة 4,000)')
    const p1 = await (await fetch(`${baseUrl}/api/projects`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'مشروع الربح', shareUnitPrice: 1000, workerProfitPercentage: 20 })
    })).json()
    const partA = await (await fetch(`${baseUrl}/api/partners`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'أحمد' }) })).json()
    const partB = await (await fetch(`${baseUrl}/api/partners`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'خالد' }) })).json()

    await fetch(`${baseUrl}/api/projects/${p1.id}/allocate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ partnerId: partA.id, shareCount: 30 }) })
    await fetch(`${baseUrl}/api/projects/${p1.id}/allocate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ partnerId: partB.id, shareCount: 20 }) })
    await fetch(`${baseUrl}/api/advances`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ partnerId: partA.id, amount: 4000 }) })

    const execProfit = await (await fetch(`${baseUrl}/api/liquidations/execute`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId: p1.id, finalAssetValue: 70000 })
    })).json()

    const liq1 = execProfit.liquidation
    console.log(`   ربح إجمالي: ${liq1.grossProfitOrLoss} | حصة العامل (20%): ${liq1.workerProfit} | وعاء الشركاء: ${liq1.investorsProfitPool}`)
    if (Number(liq1.workerProfit) !== 4000 || Number(liq1.investorsProfitPool) !== 16000) throw new Error('Profit split mismatch!')

    const payA = execProfit.payouts.find((p) => p.partnerId === partA.id)
    console.log(`   أحمد: رأس مال مسترد=${payA.capitalReturned}، ربح=${payA.profitShare}، خصم سلف=-${payA.deductedAdvances}، صافي=${payA.netPayable}`)
    if (Number(payA.capitalReturned) !== 30000 || Number(payA.profitShare) !== 9600 || Number(payA.netPayable) !== 35600) {
      throw new Error('Partner A settlement mismatch!')
    }

    const updatedP1 = await (await fetch(`${baseUrl}/api/projects/${p1.id}`)).json()
    const updatedA = await (await fetch(`${baseUrl}/api/partners/${partA.id}`)).json()
    if (updatedP1.status !== 'liquidated') throw new Error('Project status not liquidated!')
    if (Number(updatedA.outstandingLoans) !== 0) throw new Error('Partner loan not cleared on liquidation!')

    // 2. Case B: Loss Liquidation (Islamic Mudharaba Rule)
    console.log('2. اختبار حالة الخسارة (رأس مال 50,000، أصول 40,000 -> خسارة 10,000)')
    const p2 = await (await fetch(`${baseUrl}/api/projects`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'مشروع الخسارة', shareUnitPrice: 1000, workerProfitPercentage: 20 })
    })).json()
    const partC = await (await fetch(`${baseUrl}/api/partners`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'سعيد' }) })).json()
    await fetch(`${baseUrl}/api/projects/${p2.id}/allocate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ partnerId: partC.id, shareCount: 50 }) })

    const execLoss = await (await fetch(`${baseUrl}/api/liquidations/execute`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId: p2.id, finalAssetValue: 40000 })
    })).json()

    if (!execLoss.liquidation) {
      console.error('execLoss returned error:', execLoss)
      throw new Error(`execLoss failed: ${JSON.stringify(execLoss)}`)
    }

    const liq2 = execLoss.liquidation
    console.log(`   نتيجة التصفية: ${liq2.grossProfitOrLoss} | حصة العامل شرعاً: ${liq2.workerProfit} | عائد السهم: ${liq2.returnPerShare}`)
    if (Number(liq2.workerProfit) !== 0 || Number(liq2.investorsProfitPool) !== 0) throw new Error('Worker/Pool must be 0 on loss!')
    if (Number(liq2.returnPerShare) !== 800) throw new Error('Return per share on loss mismatch!')

    const payC = execLoss.payouts.find((p) => p.partnerId === partC.id)
    console.log(`   سعيد: رأس مال مسترد من الأصول=${payC.capitalReturned}، ربح=${payC.profitShare}، صافي للدفع=${payC.netPayable}`)
    if (Number(payC.capitalReturned) !== 40000 || Number(payC.netPayable) !== 40000) throw new Error('Loss settlement payout mismatch!')

    console.log(' نجحت جميع اختبارات محرك التصفية النهائية لحالتي الربح والخسارة 100%')
  } finally {
    await app.close()
  }
}

runPhase6Test().catch((err) => {
  console.error(' فشل الاختبار:', err)
  process.exit(1)
})
