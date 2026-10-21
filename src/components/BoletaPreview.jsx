import { useEffect, useRef, useState } from 'react'
import { FileSpreadsheet, LoaderCircle, Minus, Plus, RotateCcw, Upload } from 'lucide-react'

function DropZone({ fileName, isDragging, isLoading, onFileChange, setIsDragging }) {
  return (
    <label
      className={`group mx-auto flex min-h-72 w-full max-w-2xl cursor-pointer flex-col items-center justify-center border-2 border-dashed px-6 py-10 text-center transition ${
        isDragging
          ? 'border-[#2978b5] bg-[#e7f4ff]'
          : 'border-[#9bb2c5] bg-white hover:border-[#4383b2] hover:bg-[#f7fbff]'
      }`}
      onDragEnter={(event) => {
        event.preventDefault()
        setIsDragging(true)
      }}
      onDragOver={(event) => {
        event.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={(event) => {
        event.preventDefault()
        if (event.currentTarget.contains(event.relatedTarget)) return
        setIsDragging(false)
      }}
      onDrop={(event) => {
        event.preventDefault()
        setIsDragging(false)
        onFileChange(event.dataTransfer.files?.[0])
      }}
    >
      <div className={`flex h-16 w-16 items-center justify-center border shadow-sm ${
        isDragging ? 'border-[#286c9e] bg-[#cce8fb] text-[#075a9c]' : 'border-[#9eb4c5] bg-[#e8f2f9] text-[#326b94]'
      }`}>
        {isLoading ? <LoaderCircle className="h-8 w-8 animate-spin" /> : <FileSpreadsheet className="h-8 w-8" />}
      </div>

      <h2 className="mt-4 text-[17px] font-semibold text-[#164d75]">
        {isDragging ? 'Suelte el archivo para procesarlo' : 'No hay información cargada'}
      </h2>
      <p className="mt-1.5 max-w-lg text-[12px] leading-5 text-slate-600">
        Arrastre aquí el archivo Excel de boletas o utilice el botón para seleccionarlo desde su equipo.
      </p>

      <div className="classic-button mt-5">
        {isLoading ? <LoaderCircle size={15} className="animate-spin" /> : <Upload size={15} />}
        {isLoading ? 'Procesando archivo...' : fileName || 'Seleccionar archivo...'}
      </div>

      <input
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={(event) => {
          onFileChange(event.target.files?.[0])
          event.target.value = ''
        }}
      />
    </label>
  )
}

function EditableBoleta({ boletaHtml, highlightDniSignal, onChange, onReset, zoom }) {
  const ref = useRef(null)
  const viewportRef = useRef(null)
  const panRef = useRef(null)
  const [isPanning, setIsPanning] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    if (ref.current.innerHTML === boletaHtml) return
    ref.current.innerHTML = boletaHtml
  }, [boletaHtml])

  useEffect(() => {
    if (!highlightDniSignal || !ref.current) return undefined

    const targets = ref.current.querySelectorAll(
      '[data-boleta-field="dni-line"], [data-boleta-field="apellidos-line"], [data-boleta-field="nombres-line"]',
    )
    if (targets.length === 0) return undefined

    targets.forEach((target) => target.classList.add('boleta-highlight'))
    targets[0].scrollIntoView({ block: 'center', behavior: 'smooth' })

    const timeoutId = window.setTimeout(() => {
      targets.forEach((target) => target.classList.remove('boleta-highlight'))
    }, 2200)

    return () => window.clearTimeout(timeoutId)
  }, [highlightDniSignal])

  function startPan(event) {
    if (event.button !== 0 || event.target.closest('button')) return
    panRef.current = {
      x: event.clientX,
      y: event.clientY,
      scrollLeft: viewportRef.current.scrollLeft,
      scrollTop: viewportRef.current.scrollTop,
      moved: false,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function movePan(event) {
    if (!panRef.current || !viewportRef.current) return
    const deltaX = event.clientX - panRef.current.x
    const deltaY = event.clientY - panRef.current.y
    if (Math.abs(deltaX) + Math.abs(deltaY) > 3) {
      panRef.current.moved = true
      setIsPanning(true)
      event.preventDefault()
      window.getSelection()?.removeAllRanges()
      viewportRef.current.scrollLeft = panRef.current.scrollLeft - deltaX
      viewportRef.current.scrollTop = panRef.current.scrollTop - deltaY
    }
  }

  function stopPan() {
    panRef.current = null
    setIsPanning(false)
  }

  return (
    <>
      <div className="flex min-h-11 items-center border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-900">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span>
            Modo edición activo. Los cambios se aplicarán a la impresión y exportación PDF.
          </span>
          <button
            type="button"
            onClick={onReset}
            className="classic-button !min-h-8 !py-1"
          >
            <RotateCcw size={14} /> Restaurar original
          </button>
        </div>
      </div>
      <div
        ref={viewportRef}
        className={`min-h-0 flex-1 overflow-auto bg-slate-100 p-3 touch-none sm:p-6 ${isPanning ? 'select-none' : ''}`}
        onPointerDown={startPan}
        onPointerMove={movePan}
        onPointerUp={stopPan}
        onPointerCancel={stopPan}
        onLostPointerCapture={stopPan}
      >
        <div
          style={{ zoom: `${zoom}%` }}
          className="mx-auto w-full max-w-[900px]"
        >
          <div
            ref={ref}
            contentEditable
            suppressContentEditableWarning
            spellCheck={false}
            onInput={(event) => onChange(event.currentTarget.innerHTML, event.currentTarget.innerText)}
            className="font-boleta box-border min-h-[1272px] w-full cursor-text rounded-sm border border-slate-200 bg-white p-7 text-[15px] leading-[1.8] whitespace-pre-wrap break-words text-black shadow-[0_8px_24px_rgba(15,23,42,0.12)] outline-none sm:p-10 sm:text-base [&_*]:max-w-full [&_*]:text-black [&_*]:font-bold"
          />
        </div>
      </div>
    </>
  )
}

function BoletaPreview({
  boletaHtml,
  fileName,
  highlightDniSignal,
  isLoading,
  onBoletaChange,
  onFileChange,
  onResetBoleta,
  previewIsDragging,
  setPreviewIsDragging,
}) {
  const [zoom, setZoom] = useState(90)

  function changeZoom(amount) {
    setZoom((currentZoom) => Math.min(150, Math.max(60, currentZoom + amount)))
  }

  return (
    <section className="order-2 flex min-h-[560px] min-w-0 flex-col lg:order-1 lg:min-h-0">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="classic-titlebar justify-between gap-3">
          <span>Vista previa de boleta</span>
          <div className="flex items-center gap-1.5">
            <span className="mr-1 hidden font-normal sm:inline">A4 · {zoom}%</span>
            <button
              type="button"
              onClick={() => changeZoom(-10)}
              disabled={zoom <= 60}
              aria-label="Alejar boleta"
              title="Alejar"
              className="classic-icon-button !h-8 !w-8"
            >
              <Minus size={16} />
            </button>
            <span className="w-11 text-center text-xs tabular-nums sm:hidden">{zoom}%</span>
            <button
              type="button"
              onClick={() => changeZoom(10)}
              disabled={zoom >= 150}
              aria-label="Acercar boleta"
              title="Acercar"
              className="classic-icon-button !h-8 !w-8"
            >
              <Plus size={16} />
            </button>
            <button
              type="button"
              onClick={() => setZoom(90)}
              disabled={zoom === 90}
              aria-label="Restablecer zoom"
              title="Restablecer zoom"
              className="classic-icon-button !h-8 !w-8"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-100">
          {boletaHtml ? (
            <EditableBoleta
              boletaHtml={boletaHtml}
              highlightDniSignal={highlightDniSignal}
              onChange={onBoletaChange}
              onReset={onResetBoleta}
              zoom={zoom}
            />
          ) : (
            <div className="flex h-full items-center justify-center p-6 sm:p-10">
              <DropZone
                fileName={fileName}
                isDragging={previewIsDragging}
                isLoading={isLoading}
                onFileChange={onFileChange}
                setIsDragging={setPreviewIsDragging}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default BoletaPreview
