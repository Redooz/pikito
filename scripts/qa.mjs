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
  await page.keyboard.press('Control+k')
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
await page.locator('.device-node .btn-i').first().click()
await page.waitForTimeout(100)
log('help closed')

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
await page.keyboard.press('Control+k')
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

// ---- timeline: jump back one step, then redo with Ctrl+Y ----
const timelineRows = await page.locator('.timeline-row:not(.future)').count()
log('timeline past rows', timelineRows)
let nodesBeforeJump = await page.locator('.react-flow__node').count()
await page.locator('.timeline-row:not(.future)').last().click()
await page.waitForTimeout(150)
const nodesAfterJump = await page.locator('.react-flow__node').count()
log('jump back: nodes', nodesBeforeJump, '->', nodesAfterJump)
await page.keyboard.press('Control+y')
await page.waitForTimeout(150)
const nodesAfterCtrlY = await page.locator('.react-flow__node').count()
log('ctrl+y: nodes ->', nodesAfterCtrlY)
await shot('qa-08-timeline')

// ---- context menu on a node ----
await page.mouse.click(300, 700)
await page.waitForTimeout(80)
const rightClickNode = page.locator('.react-flow__node').first()
const nb = await rightClickNode.boundingBox()
await page.mouse.click(nb.x + nb.width / 2, nb.y + nb.height / 2, { button: 'right' })
await page.waitForSelector('.ctx-menu')
await shot('qa-09-ctx-menu-node')
log('node ctx menu open')
const nodesBeforeDup = await page.locator('.react-flow__node').count()
await page.locator('.ctx-menu .ctx-item', { hasText: 'DUPLICATE' }).click()
await page.waitForTimeout(200)
const nodesAfterDup = await page.locator('.react-flow__node').count()
log('duplicate:', nodesBeforeDup, '->', nodesAfterDup)
await page.mouse.click(300, 700)
await page.waitForTimeout(80)
const nodesBeforeDelete = await page.locator('.react-flow__node').count()
const delBox = await page.locator('.react-flow__node').last().boundingBox()
await page.mouse.click(delBox.x + delBox.width / 2, delBox.y + delBox.height / 2, { button: 'right' })
await page.waitForSelector('.ctx-menu')
await page.locator('.ctx-menu .ctx-item', { hasText: 'DELETE' }).click()
await page.waitForTimeout(200)
const nodesAfterDelete = await page.locator('.react-flow__node').count()
log('delete:', nodesBeforeDelete, '->', nodesAfterDelete)

// ---- touchpad gestures: two-finger scroll pans, ctrl+wheel (pinch) zooms ----
const viewportTransform = () =>
  page.locator('.react-flow__viewport').evaluate((el) => el.style.transform)
const tBefore = await viewportTransform()
await page.mouse.move(500, 500)
await page.mouse.wheel(0, 200)
await page.waitForTimeout(120)
const tAfterPan = await viewportTransform()
log('wheel pan:', tBefore, '->', tAfterPan, '| panned:', tBefore !== tAfterPan)
await page.keyboard.down('Control')
await page.mouse.wheel(0, -240)
await page.waitForTimeout(120)
await page.keyboard.up('Control')
const tAfterZoom = await viewportTransform()
log('ctrl+wheel zoom:', tAfterPan, '->', tAfterZoom, '| zoomed:', tAfterPan !== tAfterZoom)
await shot('qa-10-gestures')
await page.mouse.click(300, 700)
await page.waitForTimeout(80)

// ---- context menu on an edge ----
// the undo sequence removed the edge; redraw a connection first
const connectAgain = async () => {
  const outPort = page.locator('.react-flow__node .kind-signal').first()
  const inPort = page.locator('.react-flow__node .kind-any:not(.kind-signal)').first()
  const a2 = await outPort.boundingBox()
  const b2 = await inPort.boundingBox()
  log('connectAgain ports', a2, b2)
  await page.mouse.move(a2.x + a2.width / 2, a2.y + a2.height / 2)
  await page.mouse.down()
  await page.mouse.move(b2.x + b2.width / 2, b2.y + b2.height / 2, { steps: 12 })
  await page.mouse.up()
  await page.waitForTimeout(200)
}
await connectAgain()

const edgeCountBeforeMenu = await page.locator('.react-flow__edge').count()
if (edgeCountBeforeMenu > 0) {
  const eb = await page.locator('.react-flow__edge path').first().boundingBox()
  await page.mouse.click(eb.x + eb.width / 2, eb.y + eb.height / 2, { button: 'right' })
  await page.waitForSelector('.ctx-menu')
  await shot('qa-10-ctx-menu-edge')
  await page.locator('.ctx-menu .ctx-item', { hasText: 'DELETE' }).click()
}
await page.waitForTimeout(200)
const edgesAfterMenu = await page.locator('.react-flow__edge').count()
log('edges before menu', edgeCountBeforeMenu, 'after menu', edgesAfterMenu)

// ---- picker arrow navigation + esc semantics ----
await page.keyboard.press('Control+k')
await page.waitForSelector('.picker input')
await page.keyboard.press('ArrowDown')
await page.waitForTimeout(80)
const hlCount = await page.locator('.picker .item.hl').count()
log('highlight after ArrowDown', hlCount)
await page.keyboard.press('Enter')
await page.waitForTimeout(150)
const nodesAfterArrowPick = await page.locator('.react-flow__node').count()
log('arrow+enter add ->', nodesAfterArrowPick)

await page.keyboard.press('Control+k')
await page.waitForSelector('.picker input')
await page.keyboard.press('ArrowDown')
await page.keyboard.press('Escape')
await page.waitForTimeout(80)
const pickerStillOpen = await page.locator('.picker').count()
log('esc on highlighted -> picker open?', pickerStillOpen)
await page.keyboard.press('Escape')
await page.waitForTimeout(80)
const pickerClosed = await page.locator('.picker').count()
log('esc again -> picker closed?', pickerClosed === 0)

await page.keyboard.press('Control+k')
await page.waitForSelector('.picker input')
await page.locator('.picker .kbd-btn', { hasText: 'ESC' }).click()
await page.waitForTimeout(80)
const pickerClosedByClick = await page.locator('.picker').count()
log('esc text click -> picker closed?', pickerClosedByClick === 0)
await shot('qa-11-picker-closed')

for (const lang of ['FR', 'ES', 'EN']) {
  await page.locator('.topbar .btn-group button', { hasText: lang }).first().click()
  await page.waitForTimeout(120)
  const playLabel = await page.locator('.topbar .btn-live').first().innerText()
  log('lang', lang, 'play-label', playLabel)
}

console.log(
  'RESULT',
  JSON.stringify(
    {
      nodeCount,
      edgeCount,
      nodesAfterUndo,
      edgesAfterUndo,
      nodesAfterRedo,
      timelineRows,
      nodesAfterJump,
      nodesAfterCtrlY,
      panned: tBefore !== tAfterPan,
      zoomed: tAfterPan !== tAfterZoom,
      nodesAfterDup,
      nodesAfterDelete,
      edgesAfterMenu,
      nodesAfterArrowPick,
      pickerStillOpen,
      pickerClosed,
      pickerClosedByClick,
      errors,
    },
    null,
    2,
  ),
)
await browser.close()
