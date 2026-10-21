function normalizeText(text) {
  return text
    .replace(/\r/g, '')
    .replace(/\u00a0/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trimEnd()
}

let sealDataPromise

function loadSealData() {
  if (!sealDataPromise) {
    sealDataPromise = fetch(`${import.meta.env.BASE_URL}SELLO.png`)
      .then((response) => {
        if (!response.ok) throw new Error('No se pudo cargar la imagen del sello.')
        return response.blob()
      })
      .then((blob) => new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = () => reject(new Error('No se pudo leer la imagen del sello.'))
        reader.readAsDataURL(blob)
      }))
  }

  return sealDataPromise
}

function writePage(doc, text, sealData) {
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
    if (rawLine.trim() === '[[SELLO]]') {
      const sealWidth = 80
      const sealHeight = 32
      if (y + sealHeight > 282) {
        doc.addPage()
        y = top
      }
      const sealOffsetY = 18
      doc.addImage(sealData, 'PNG', (210 - sealWidth) / 2, y - sealOffsetY, sealWidth, sealHeight)
      y += sealHeight
      continue
    }

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
  const { jsPDF } = await import('jspdf')
  const sealData = await loadSealData()
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })

  pageTexts.forEach((text, index) => {
    if (index > 0) doc.addPage()
    writePage(doc, text, sealData)
  })

  doc.save(filename)
}
