require('reflect-metadata')
const { NestFactory } = require('@nestjs/core')
const { AppModule } = require('./dist/app.module')

async function runSoftAndHardDeleteTest() {
  console.log('--- بدء الاختبار التكاملي لنظام الحذف المؤقت والنهائي (Soft & Hard Delete) ---')
  const app = await NestFactory.create(AppModule, { logger: false })
  const port = 5094
  await app.listen(port)
  const baseUrl = `http://localhost:${port}`

  try {
    // 1. Create a dummy project
    console.log('1. إنشاء مشروع تجريبي')
    const resCreate = await fetch(`${baseUrl}/api/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'مشروع اختبار الحذف', shareUnitPrice: 100, workerProfitPercentage: 10 })
    })
    const project = await resCreate.json()
    if (!project.id) throw new Error('Create project failed!')
    const id = project.id

    // 2. Soft Delete project
    console.log('2. الحذف المؤقت (Soft Delete)')
    const resSoftDel = await fetch(`${baseUrl}/api/projects/${id}`, { method: 'DELETE' })
    if (resSoftDel.status !== 200) throw new Error('Soft delete request failed!')

    // Verify not in active list
    const activeList = await (await fetch(`${baseUrl}/api/projects`)).json()
    if (activeList.some((p) => p.id === id)) throw new Error('Soft-deleted project still appears in active projects!')

    // Verify in trash list
    const trashList1 = await (await fetch(`${baseUrl}/api/projects/trash`)).json()
    if (!trashList1.some((p) => p.id === id)) throw new Error('Soft-deleted project not found in /trash!')

    // 3. Restore project
    console.log('3. استعادة المشروع من السلة')
    const resRestore = await fetch(`${baseUrl}/api/projects/${id}/restore`, { method: 'PATCH' })
    if (resRestore.status !== 200) throw new Error('Restore request failed!')

    const activeListAfterRestore = await (await fetch(`${baseUrl}/api/projects`)).json()
    if (!activeListAfterRestore.some((p) => p.id === id)) throw new Error('Restored project not in active projects!')

    const trashListAfterRestore = await (await fetch(`${baseUrl}/api/projects/trash`)).json()
    if (trashListAfterRestore.some((p) => p.id === id)) throw new Error('Restored project still found in /trash!')

    // 4. Soft delete again
    console.log('4. إعادة الحذف المؤقت قبل الحذف النهائي')
    await fetch(`${baseUrl}/api/projects/${id}`, { method: 'DELETE' })
    const trashList2 = await (await fetch(`${baseUrl}/api/projects/trash`)).json()
    if (!trashList2.some((p) => p.id === id)) throw new Error('Re-soft-deleted project not in trash!')

    // 5. Permanent Delete (Hard Delete)
    console.log('5. الحذف النهائي البات (Permanent Delete)')
    const resHardDel = await fetch(`${baseUrl}/api/projects/${id}/permanent`, { method: 'DELETE' })
    if (resHardDel.status !== 200) throw new Error('Permanent delete request failed!')

    // Verify gone from trash
    const trashListAfterHard = await (await fetch(`${baseUrl}/api/projects/trash`)).json()
    if (trashListAfterHard.some((p) => p.id === id)) throw new Error('Hard-deleted project still in trash!')

    // Verify 404 when querying directly
    const resFindOne = await fetch(`${baseUrl}/api/projects/${id}`)
    if (resFindOne.status !== 404) throw new Error('Hard-deleted entity still returned status other than 404!')

    // 6. Test with Partner as well
    console.log('6. اختبار الحذف النهائي لشريك')
    const partner = await (await fetch(`${baseUrl}/api/partners`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'شريك تجربة الحذف النهائي' })
    })).json()
    await fetch(`${baseUrl}/api/partners/${partner.id}/permanent`, { method: 'DELETE' })
    const resPartnerFind = await fetch(`${baseUrl}/api/partners/${partner.id}`)
    if (resPartnerFind.status !== 404) throw new Error('Hard-deleted partner still exists!')

    console.log(' نجحت دورة الحذف المؤقت والاستعادة والحذف النهائي 100%')
  } finally {
    await app.close()
  }
}

runSoftAndHardDeleteTest().catch((err) => {
  console.error(' فشل الاختبار:', err)
  process.exit(1)
})

