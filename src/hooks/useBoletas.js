import { useState } from 'react'
import { generarBoleta, generarDocumentoImpresion } from '../utils/boletaGenerator'
import { parseExcelFile } from '../utils/excelParser'
import { generarPDF } from '../utils/pdfGenerator'

export function useBoletas() {
  const [data, setData] = useState([])
  const [dataFiltrada, setDataFiltrada] = useState([])
  const [editedBoletas, setEditedBoletas] = useState({})
  const [index, setIndex] = useState(0)
  const [fechaTexto, setFechaTexto] = useState('')
  const [textoEstablecimiento, setTextoEstablecimiento] = useState('')
  const [establecimientoSeleccionado, setEstablecimientoSeleccionado] = useState('TODOS')
  const [toast, setToast] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [fileName, setFileName] = useState('')
  const [isExportingPdf, setIsExportingPdf] = useState(false)
  const [highlightDniSignal, setHighlightDniSignal] = useState(0)

  const establecimientos = [...new Set(data.map((d) => d.Establecimiento))]
    .filter(Boolean)
    .sort()

  const establecimientosVisibles = establecimientos.filter((establecimiento) => (
    establecimiento.toUpperCase().includes(textoEstablecimiento.trim().toUpperCase())
  ))

  const currentRecord = dataFiltrada[index] || null
  const currentEditedBoleta = currentRecord ? editedBoletas[currentRecord.NumeroBoleta] : null
  const currentBoleta = currentRecord
    ? currentEditedBoleta?.html || generarBoleta(currentRecord, fechaTexto)
    : ''

  function showToast(message, type = 'error') {
    setToast({ id: Date.now(), message, type })
  }

  function closeToast() {
    setToast(null)
  }

  function clearHighlight() {
    setHighlightDniSignal(0)
  }

  function applyFilters(nextData, nextText, nextSelection) {
    const input = nextText.trim().toUpperCase()

    let filtered = [...nextData]
    if (nextSelection !== 'TODOS') {
      filtered = filtered.filter((d) => d.Establecimiento === nextSelection)
    } else if (input !== '') {
      filtered = filtered.filter((d) => (
        (d.Establecimiento || '').toUpperCase().includes(input)
      ))
    }

    setDataFiltrada(filtered)
    setIndex(0)
  }

  async function loadExcel(file) {
    if (!file) return

    try {
      setIsLoading(true)
      const result = await parseExcelFile(file)

      setData(result.data)
      setFechaTexto(result.fechaTexto)
      setFileName(file.name)
      setTextoEstablecimiento('')
      setEstablecimientoSeleccionado('TODOS')
      setDataFiltrada([...result.data])
      setEditedBoletas({})
      setIndex(0)
      setToast(null)
      showToast(`${result.data.length} registros cargados`, 'success')
    } catch (error) {
      showToast(error.message, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  function updateEstablecimientoText(value) {
    setTextoEstablecimiento(value)
    setEstablecimientoSeleccionado('TODOS')
    applyFilters(data, value, 'TODOS')
  }

  function filterByEstablecimiento(value) {
    setEstablecimientoSeleccionado(value)
    applyFilters(data, textoEstablecimiento, value)
  }

  function searchRecords(query, mode = 'dni') {
    const term = query?.trim()
    if (!term) return false

    const normalizedTerm = term.toUpperCase()
    const idx = dataFiltrada.findIndex((d) => {
      if (mode === 'name') {
        return (d.ADMINISTRATIVO || '').toUpperCase().includes(normalizedTerm)
      }

      return d.DNI === term
    })

    if (idx !== -1) {
      setIndex(idx)
      setHighlightDniSignal(Date.now())
      return true
    }

    showToast(
      mode === 'name'
        ? 'Nombre no encontrado en la base de datos'
        : 'DNI no encontrado en la base de datos',
      'error',
    )
    return false
  }

  function goTo(position) {
    if (dataFiltrada.length === 0) return
    clearHighlight()
    const nextIndex = Math.max(0, Math.min(position, dataFiltrada.length - 1))
    setIndex(nextIndex)
  }

  function next() {
    if (index < dataFiltrada.length - 1) {
      clearHighlight()
      setIndex(index + 1)
    }
  }

  function previous() {
    if (index > 0) {
      clearHighlight()
      setIndex(index - 1)
    }
  }

  function openPrintFrame(html) {
    const iframe = document.createElement('iframe')
    iframe.style.position = 'fixed'
    iframe.style.right = '0'
    iframe.style.bottom = '0'
    iframe.style.width = '0'
    iframe.style.height = '0'
    iframe.style.border = '0'
    iframe.setAttribute('aria-hidden', 'true')

    const cleanup = () => {
      window.setTimeout(() => iframe.remove(), 1000)
    }

    iframe.onload = () => {
      const frameWindow = iframe.contentWindow
      if (!frameWindow) {
        showToast('No se pudo abrir la impresión', 'error')
        cleanup()
        return
      }

      window.setTimeout(() => {
        frameWindow.focus()
        frameWindow.print()
        cleanup()
      }, 250)
    }

    document.body.appendChild(iframe)
    iframe.srcdoc = html
  }

  function printCurrent() {
    if (!currentRecord) return

    const contenido = editedBoletas[currentRecord.NumeroBoleta] || generarBoleta(currentRecord, fechaTexto)
    openPrintFrame(generarDocumentoImpresion(`<div>${contenido.html || contenido}</div>`))
  }

  function printAll() {
    if (dataFiltrada.length === 0) return

    const contenido = dataFiltrada
      .map((d) => {
        const html = editedBoletas[d.NumeroBoleta] || generarBoleta(d, fechaTexto)
        return `<div class="pagina">${html.html || html}</div>`
      })
      .join('')

    openPrintFrame(generarDocumentoImpresion(contenido))
  }

  async function downloadCurrentPDF() {
    if (!currentRecord) return

    try {
      setIsExportingPdf(true)
      const html = editedBoletas[currentRecord.NumeroBoleta]
      const text = html?.text || currentBoleta.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '')
      await generarPDF([text], `boleta-${currentRecord.DNI || currentRecord.NumeroBoleta}.pdf`)
      showToast('PDF actual generado', 'success')
    } catch {
      showToast('No se pudo generar el PDF actual', 'error')
    } finally {
      setIsExportingPdf(false)
    }
  }

  async function downloadAllPDF() {
    if (dataFiltrada.length === 0) return

    try {
      setIsExportingPdf(true)
      const pages = dataFiltrada.map((record) => {
        const edited = editedBoletas[record.NumeroBoleta]
        if (edited?.text) return edited.text

        const html = generarBoleta(record, fechaTexto)
        return html.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '')
      })
      await generarPDF(pages, `boletas-${fechaTexto || 'cafae'}.pdf`)
      showToast('PDF de boletas generado', 'success')
    } catch {
      showToast('No se pudo generar el PDF de boletas', 'error')
    } finally {
      setIsExportingPdf(false)
    }
  }

  function updateCurrentBoleta(html, text) {
    if (!currentRecord) return

    setEditedBoletas((prev) => ({
      ...prev,
      [currentRecord.NumeroBoleta]: { html, text },
    }))
  }

  function resetCurrentBoleta() {
    if (!currentRecord) return

    setEditedBoletas((prev) => {
      const next = { ...prev }
      delete next[currentRecord.NumeroBoleta]
      return next
    })
  }

  return {
    currentBoleta,
    currentRecord,
    dataFiltrada,
    downloadAllPDF,
    downloadCurrentPDF,
    establecimientosVisibles,
    establecimientoSeleccionado,
    fechaTexto,
    fileName,
    index,
    isExportingPdf,
    isLoading,
    loadExcel,
    next,
    previous,
    goTo,
    highlightDniSignal,
    printAll,
    printCurrent,
    recordCount: dataFiltrada.length,
    regActual: `${dataFiltrada.length > 0 ? index + 1 : 0}/${dataFiltrada.length}`,
    searchRecords,
    selectedEstablishmentText: textoEstablecimiento,
    setEstablishmentText: updateEstablecimientoText,
    setSelectedEstablishment: filterByEstablecimiento,
    showToast,
    toast,
    closeToast,
    resetCurrentBoleta,
    updateCurrentBoleta,
  }
}
