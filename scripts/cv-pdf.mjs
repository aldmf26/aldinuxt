// Print /cv (ID) and /en/cv (EN) to ATS-friendly PDFs in public/cv/.
// Usage: start a production server, then `node scripts/cv-pdf.mjs http://127.0.0.1:4400`
import { chromium } from 'playwright'

const base = (process.argv[2] || 'http://127.0.0.1:4400').replace(/\/$/, '')
const browser = await chromium.launch()
const page = await browser.newPage()
for (const [lang, path] of [['ID', '/cv'], ['EN', '/en/cv']]) {
  await page.goto(base + path, { waitUntil: 'networkidle' })
  await page.emulateMedia({ media: 'print' })
  const out = `public/cv/Muhammad-Fahrizaldi-CV-${lang}.pdf`
  await page.pdf({ path: out, format: 'A4', printBackground: false, preferCSSPageSize: true })
  console.log('wrote', out)
}
await browser.close()
