require('reflect-metadata')
const { NestFactory } = require('@nestjs/core')
const { AppModule } = require('./dist/app.module')

async function runIntegrationTest() {
  console.log('--- بدء الاختبار التكاملي التلقائي للمرحلة 2 (Fullstack Soft Delete) ---')
  const app = await NestFactory.create(AppModule, { logger: false })
  const port = 5055
  await app.listen(port)
  const baseUrl = `http://localhost:${port}`

  try {
    // 1. Create a test project
    console.log('1. اختبار إنشاء مشروع في قاعدة البيانات عبر POST /api/projects')
    const createRes = await fetch(`${baseUrl}/api/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'مشروع اختبار تلقائي', workerProfitPercentage: 25 })
    })
    if (!createRes.ok) throw new Error(`Create failed: ${createRes.statusText}`)
    const created = await createRes.json()
    console.log(`   تم إنشاء المشروع بنجاح: ID=${created.id}, Name=${created.name}`)

    // 2. Query active list
    console.log('2. التحقق من ظهور المشروع في القائمة النشطة عبر GET /api/projects')
    const listRes = await fetch(`${baseUrl}/api/projects`)
    const activeList = await listRes.json()
    if (!activeList.some((p) => p.id === created.id)) throw new Error('Project not found in active list')
    console.log('   تم العثور على المشروع في القائمة النشطة.')

    // 3. Soft delete
    console.log('3. تنفيذ الحذف المؤقت عبر DELETE /api/projects/:id')
    const delRes = await fetch(`${baseUrl}/api/projects/${created.id}`, { method: 'DELETE' })
    if (!delRes.ok) throw new Error(`Delete failed: ${delRes.statusText}`)
    console.log('   تم تنفيذ استدعاء الحذف المؤقت بنجاح.')

    // 4. Verify excluded from active list
    console.log('4. التحقق من اختفاء المشروع من القائمة النشطة تلقائياً')
    const postDelList = await (await fetch(`${baseUrl}/api/projects`)).json()
    if (postDelList.some((p) => p.id === created.id)) throw new Error('Soft-deleted project still in active list!')
    console.log('   المشروع محجوب عن القائمة النشطة بنجاح (WHERE deletedAt IS NULL).')

    // 5. Verify presence in /trash
    console.log('5. التحقق من ظهور المشروع في سلة المحذوفات عبر GET /api/projects/trash')
    const trashList = await (await fetch(`${baseUrl}/api/projects/trash`)).json()
    const trashed = trashList.find((p) => p.id === created.id)
    if (!trashed || !trashed.deletedAt) throw new Error('Project not found in trash or deletedAt missing!')
    console.log(`   المشروع متواجد بسلة المحذوفات وتاريخ الحذف: ${trashed.deletedAt}`)

    // 6. Restore
    console.log('6. تنفيذ الاستعادة عبر PATCH /api/projects/:id/restore')
    const restoreRes = await fetch(`${baseUrl}/api/projects/${created.id}/restore`, { method: 'PATCH' })
    if (!restoreRes.ok) throw new Error(`Restore failed: ${restoreRes.statusText}`)

    // 7. Verify restored in active list
    console.log('7. التحقق من عودة المشروع للقائمة النشطة واختفائه من السلة')
    const finalActive = await (await fetch(`${baseUrl}/api/projects`)).json()
    if (!finalActive.some((p) => p.id === created.id)) throw new Error('Project was not restored!')
    const finalTrash = await (await fetch(`${baseUrl}/api/projects/trash`)).json()
    if (finalTrash.some((p) => p.id === created.id)) throw new Error('Project still in trash after restore!')
    console.log('   تمت الاستعادة بنجاح والمشروع نشط مجدداً.')

    console.log(' جميع الاختبارات التكاملية نجحت 100% بنتيجة ممتازة.')
  } finally {
    await app.close()
  }
}

runIntegrationTest().catch((err) => {
  console.error(' فشل الاختبار التكاملي:', err)
  process.exit(1)
})

