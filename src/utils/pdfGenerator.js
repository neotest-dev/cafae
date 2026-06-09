import { jsPDF } from 'jspdf'

function normalizeText(text) {
  return text
    .replace(/\r/g, '')
    .replace(/\u00a0/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trimEnd()
}

function writePage(doc, text) {
  const marginX = 12
  const top = 14
  const lineHeight = 5.4
  const maxWidth = 186
  let y = top

  doc.setFont('courier', 'bold')
  doc.setFontSize(10.5)
  doc.setTextColor(0, 0, 0)

  const lines = normalizeText(text).split('\n')

  for (const rawLine of lines) {
    const line = rawLine || ' '
    const wrapped = doc.splitTextToSize(line, maxWidth)

    for (const chunk of wrapped) {
      if (y > 282) {
        doc.addPage()
        y = top
        doc.setFont('courier', 'bold')
        doc.setFontSize(10.5)
        doc.setTextColor(0, 0, 0)
      }

      doc.text(chunk || ' ', marginX, y)
      y += lineHeight
    }
  }
}

export async function generarPDF(pageTexts, filename) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })

  pageTexts.forEach((text, index) => {
    if (index > 0) doc.addPage()
    writePage(doc, text)
  })

  doc.save(filename)
}
