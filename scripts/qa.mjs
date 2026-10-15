import { chromium } from 'playwright-core'

const BASE = process.env.BASE_URL ?? 'http://localhost:4173'

const browser = await chromium.launch({
  executablePath: '/usr/bin/chromium',
  args: ['--no-sandbox', '--disable-gpu'],
})
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const errors = []
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(`console: ${m.text()}`)
})

await page.goto(BASE, { waitUntil: 'networkidle' })
await page.waitForSelector('.react-flow')

const shot = (name) => page.screenshot({ path: `/tmp/opencode/${name}.png` })
const log = (...a) => console.log('[qa]', ...a)

await shot('qa-01-boot')
log('boot ok')

await page
  .locator('.topbar button[title="THEME"], .topbar button[title="TEMA"], .topbar button[title="THÈME"]')
  .first()
  .click()
await page.waitForTimeout(150)
await shot('qa-02-theme-toggled')
log('theme toggled')

const pickByKeyboard = async (query) => {
  await page.keyboard.press('Tab')
  await page.waitForSelector('.picker input')
  await page.keyboard.type(query)
  await page.keyboard.press('Enter')
  await page.waitForTimeout(150)
}

await pickByKeyboard('CTRL')
log('added const')
await shot('qa-03-const')

await pickByKeyboard('OUT.01')
log('added viz')
await shot('qa-04-two-nodes')

const nodeCount = await page.locator('.react-flow__node').count()
await shot('qa-04-two-nodes')

const dragHeader = async (node, dx, dy) => {
  const h = node.locator('.device-node .head').first()
  const hb = await h.boundingBox()
  await page.mouse.move(hb.x + 30, hb.y + 10)
  await page.mouse.down()
  await page.mouse.move(hb.x + 30 + dx, hb.y + 10 + dy, { steps: 10 })
  await page.mouse.up()
  await page.waitForTimeout(120)
}

const vizNode = page.locator('.react-flow__node', { hasText: /VISOR|MONITEUR|MONITOR/ }).first()
const constNode = page.locator('.react-flow__node', { hasText: 'CTRL.01' }).first()
await dragHeader(vizNode, 180, -160)
await dragHeader(constNode, -220, 40)

const constOut = constNode.locator('.kind-signal')
const vizIn = vizNode.locator('.kind-any')
const a = await constOut.boundingBox()
const b = await vizIn.boundingBox()
log('ports', a, b)
await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2)
await page.mouse.down()
await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 12 })
await page.mouse.up()
await page.waitForTimeout(200)
const edgeCount = await page.locator('.react-flow__edge').count()
log('edgeCount', edgeCount)
await shot('qa-05-connected')

await page.locator('.device-node .btn-i').first().click()
await page.waitForTimeout(150)
log('help open')
await shot('qa-06-help')

const slide = page.locator('.inspector input[type="range"]').first()
await slide.waitFor({ state: 'attached' })
const box = await slide.boundingBox()
const before = await slide.inputValue()
await page.mouse.move(box.x + box.width * 0.8, box.y + box.height / 2)
await page.mouse.down()
await page.mouse.up()
const afterSlide = await page.getByRole('button', { name: /UNDO/i }).isDisabled()
log('slider before', before, 'undo disabled', afterSlide)

await page.mouse.click(300, 700)
await page.waitForTimeout(80)
await page.keyboard.press('Tab')
await page.waitForSelector('.picker input')
await page.keyboard.press('Escape')
log('picker tab open, esc close')

const undoBtn = page.locator('.topbar button', { hasText: 'UNDO' })
await undoBtn.waitFor({ state: 'visible' })
const undoSteps = []
for (let i = 0; i < 4; i++) {
  const disabled = await undoBtn.isDisabled()
  undoSteps.push({ i, disabled })
  if (!disabled) {
    await undoBtn.click()
    await page.waitForTimeout(150)
  }
}
const nodesAfterUndo = await page.locator('.react-flow__node').count()
const edgesAfterUndo = await page.locator('.react-flow__edge').count()
log('undo steps', JSON.stringify(undoSteps), 'nodes', nodesAfterUndo, 'edges', edgesAfterUndo)
await shot('qa-07-after-undo')

const redoBtn = page.locator('.topbar button', { hasText: 'REDO' })
await redoBtn.click()
await page.waitForTimeout(150)
const nodesAfterRedo = await page.locator('.react-flow__node').count()
log('nodes after 1 redo', nodesAfterRedo)

for (const lang of ['FR', 'ES', 'EN']) {
  await page.locator('.topbar .btn-group button', { hasText: lang }).first().click()
  await page.waitForTimeout(120)
  const playLabel = await page.locator('.topbar .btn-live').first().innerText()
  log('lang', lang, 'play-label', playLabel)
}

console.log(
  'RESULT',
  JSON.stringify({ nodeCount, edgeCount, nodesAfterUndo, edgesAfterUndo, nodesAfterRedo, errors }, null, 2),
)
await browser.close()
