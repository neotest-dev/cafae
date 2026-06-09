import { DownloadIcon, FileTextIcon, PrinterIcon } from './Icons'

function ActionButton({ colorClass, disabled, onClick, children }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`w-full rounded-2xl px-4 py-3 text-[13px] font-extrabold tracking-[0.06em] text-white shadow-lg transition disabled:grayscale disabled:opacity-50 ${colorClass}`}
    >
      <span className="flex items-center justify-center gap-2">{children}</span>
    </button>
  )
}

function ActionPanel({ disabled, isExportingPdf, onDownloadPDFAll, onDownloadPDFCurrent, onPrintAll, onPrintCurrent }) {
  return (
    <section className="space-y-3 rounded-[1.6rem] border border-slate-200 bg-white p-4 shadow-md shadow-slate-200/60">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-900">
            Acciones
          </h3>
          <p className="mt-1 text-[11px] text-slate-500">
            Imprime o exporta las boletas seleccionadas.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <ActionButton
          colorClass="bg-emerald-600 shadow-emerald-100 hover:bg-emerald-700"
          disabled={disabled}
          onClick={onPrintCurrent}
        >
          <PrinterIcon className="h-4 w-4" />
          IMPRIMIR ACTUAL
        </ActionButton>
        <ActionButton
          colorClass="bg-sky-500 shadow-sky-100 hover:bg-sky-600"
          disabled={disabled}
          onClick={onPrintAll}
        >
          <FileTextIcon className="h-4 w-4" />
          IMPRIMIR TODAS
        </ActionButton>
        <ActionButton
          colorClass="bg-violet-600 shadow-violet-100 hover:bg-violet-700"
          disabled={disabled || isExportingPdf}
          onClick={onDownloadPDFCurrent}
        >
          <DownloadIcon className="h-4 w-4" />
          PDF ACTUAL
        </ActionButton>
        <ActionButton
          colorClass="bg-fuchsia-600 shadow-fuchsia-100 hover:bg-fuchsia-700"
          disabled={disabled || isExportingPdf}
          onClick={onDownloadPDFAll}
        >
          <DownloadIcon className="h-4 w-4" />
          PDF TODAS
        </ActionButton>
      </div>
    </section>
  )
}

export default ActionPanel
