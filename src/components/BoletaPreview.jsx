import { useEffect, useRef } from 'react'
import { LoaderIcon, UploadIcon } from './Icons'

function DropZone({ fileName, isDragging, isLoading, onFileChange, setIsDragging }) {
  return (
    <label
      className={`group mx-auto flex w-full max-w-xl cursor-pointer flex-col items-center justify-center rounded-[2rem] border-2 border-dashed px-8 py-12 text-center transition ${
        isDragging
          ? 'border-blue-500 bg-blue-50 shadow-[0_25px_70px_-35px_rgba(59,130,246,0.6)]'
          : 'border-slate-300 bg-white/90 shadow-[0_25px_70px_-35px_rgba(15,23,42,0.35)] backdrop-blur'
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
      <div className={`flex h-20 w-20 items-center justify-center rounded-[1.7rem] ${
        isDragging ? 'bg-blue-600 text-white' : 'bg-slate-900 text-white'
      }`}>
        {isLoading ? <LoaderIcon className="h-9 w-9 animate-spin" /> : <UploadIcon className="h-9 w-9" />}
      </div>

      <p className="mt-6 text-xs font-black uppercase tracking-[0.28em] text-slate-500">
        {isDragging ? 'Suelta el archivo aquí' : 'Arrastra tu archivo Excel'}
      </p>
      <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900">
        Genera boletas sin perder tiempo
      </h2>
      <p className="mt-3 max-w-lg text-sm leading-6 text-slate-500">
        Carga tu archivo, revisa cada registro, busca por DNI, filtra por establecimiento e imprime o exporta a PDF.
      </p>

      <div className="mt-6 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600">
        {isLoading ? 'Procesando archivo...' : fileName || 'o haz clic aquí para seleccionarlo'}
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

function EditableBoleta({ boletaHtml, highlightDniSignal, onChange, onReset }) {
  const ref = useRef(null)

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

  return (
    <>
      <div className="border-b border-slate-200 bg-amber-50 px-6 py-3 text-xs font-semibold text-amber-900">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span>
            Puedes editar directamente esta boleta. Lo que corrijas aqui tambien se usara al imprimir y al exportar PDF.
          </span>
          <button
            type="button"
            onClick={onReset}
            className="rounded-full border border-amber-300 bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-amber-900 transition hover:bg-amber-100"
          >
            Restaurar original
          </button>
        </div>
      </div>
      <div className="h-full overflow-auto px-5 py-5 sm:px-6 sm:py-5 lg:px-6 xl:px-7">
        <div
          ref={ref}
          contentEditable
          suppressContentEditableWarning
          spellCheck={false}
          onInput={(event) => onChange(event.currentTarget.innerHTML, event.currentTarget.innerText)}
          className="font-boleta min-h-full w-fit min-w-[72ch] max-w-[72ch] bg-transparent p-4 text-[12px] leading-relaxed whitespace-pre text-black outline-none sm:p-5 sm:text-[12.5px] [&_*]:text-black [&_*]:font-bold"
        />
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
  return (
    <section className="order-2 h-full min-w-0 lg:order-1 lg:justify-self-start xl:max-w-[780px]">
      <div className="flex h-full min-h-[620px] flex-col overflow-hidden rounded-[2rem] border border-slate-300 bg-white shadow-[0_20px_50px_-12px_rgba(15,23,42,0.18)] lg:min-h-0">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-100/80 px-6 py-3">
          <div className="flex gap-2">
            <span className="h-3 w-3 rounded-full bg-red-400" />
            <span className="h-3 w-3 rounded-full bg-amber-400" />
            <span className="h-3 w-3 rounded-full bg-emerald-400" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
            Vista de Pre-impresión A4
          </span>
        </div>

        <div className="relative flex-1 overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]">
          {boletaHtml ? (
            <EditableBoleta
              boletaHtml={boletaHtml}
              highlightDniSignal={highlightDniSignal}
              onChange={onBoletaChange}
              onReset={onResetBoleta}
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
