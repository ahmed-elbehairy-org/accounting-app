require('reflect-metadata')
const { NestFactory } = require('@nestjs/core')
const { AppModule } = require('./dist/app.module')

async function runPhase7Test() {
  console.log('--- بدء الاختبار التكاملي التلقائي للمرحلة 7 (إدارة الشركاء وكشوف الحسابات) ---')
  const app = await NestFactory.create(AppModule, { logger: false })
  const port = 5092
  await app.listen(port)
  const baseUrl = `http://localhost:${port}`

  try {
    // 1. Create Partner
    console.log('1. إنشاء شريك جديد')
    const partner = await (await fetch(`${baseUrl}/api/partners`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'طارق الزيات', phone: '01012345678', email: 'tarek@example.com' })
    })).json()
    if (!partner.id || partner.name !== 'طارق الزيات') throw new Error('Create partner failed!')

    // 2. Issue Advance
    console.log('2. صرف سلفة مالية بقيمة 3,000 ج')
    const advance = await (await fetch(`${baseUrl}/api/advances`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ partnerId: partner.id, amount: 3000, notes: 'سلفة طارئة للمرحلة 7' })
    })).json()
    if (Number(advance.amount) !== 3000) throw new Error('Advance issuance failed!')

    // 3. Check Statement after advance
    console.log('3. التحقق من كشف الحساب بعد صرف السلفة')
    let stmt = await (await fetch(`${baseUrl}/api/partners/${partner.id}/statement`)).json()
    if (Number(stmt.summary.outstandingLoans) !== 3000) throw new Error('Statement loan mismatch!')
    if (stmt.loans.length !== 1 || Number(stmt.loans[0].amount) !== 3000) throw new Error('Loan record mismatch!')

    // 4. Create Project & Allocate Shares
    console.log('4. إنشاء مشروع وتخصيص 10 أسهم (10,000 ج) للشريك')
    const project = await (await fetch(`${baseUrl}/api/projects`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'مشروع استثماري مرحلة 7', shareUnitPrice: 1000, workerProfitPercentage: 20 })
    })).json()
    await fetch(`${baseUrl}/api/projects/${project.id}/allocate`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ partnerId: partner.id, shareCount: 10 })
    })

    // 5. Check Statement after allocation
    console.log('5. التحقق من كشف الحساب بعد الاكتتاب')
    stmt = await (await fetch(`${baseUrl}/api/partners/${partner.id}/statement`)).json()
    if (stmt.summary.activeSharesCount !== 10) throw new Error('Statement activeSharesCount mismatch!')
    if (Number(stmt.summary.totalInvestedCapital) !== 10000) throw new Error('Statement capital mismatch!')
    if (stmt.investments.length !== 1) throw new Error('Investments list mismatch!')

    // 6. Check Global Partner Stats
    console.log('6. فحص الإحصائيات العامة للشركاء')
    const stats = await (await fetch(`${baseUrl}/api/partners/stats`)).json()
    if (stats.totalCount < 1 || Number(stats.totalOutstandingLoans) < 3000) throw new Error('Stats API mismatch!')

    // 7. Soft Delete and Restore
    console.log('7. اختبار الحذف المؤقت والاستعادة')
    await fetch(`${baseUrl}/api/partners/${partner.id}`, { method: 'DELETE' })
    const inTrash = await (await fetch(`${baseUrl}/api/partners/trash`)).json()
    if (!inTrash.some((p) => p.id === partner.id)) throw new Error('Partner not in trash!')

    await fetch(`${baseUrl}/api/partners/${partner.id}/restore`, { method: 'PATCH' })
    const restored = await (await fetch(`${baseUrl}/api/partners/${partner.id}`)).json()
    if (restored.deletedAt !== null) throw new Error('Partner not restored!')

    console.log(' نجح اختبار دورة حياة الشريك وكشف الحساب والإحصائيات 100%')
  } finally {
    await app.close()
  }
}

runPhase7Test().catch((err) => {
  console.error(' فشل الاختبار:', err)
  process.exit(1)
})
