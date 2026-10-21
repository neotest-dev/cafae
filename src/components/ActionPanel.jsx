import { Download, FileStack, LoaderCircle, Printer } from 'lucide-react'

function ActionButton({ colorClass, disabled, onClick, children }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`classic-action-button ${colorClass}`}
    >
      {children}
    </button>
  )
}

function ActionPanel({ disabled, isExportingPdf, onDownloadPDFAll, onDownloadPDFCurrent, onPrintAll, onPrintCurrent, className = '' }) {
  return (
    <section className={`classic-panel ${className}`}>
      <div className="flex items-center px-3 pb-2 pt-3">
        <span className="text-xs font-semibold text-slate-700">Acciones</span>
      </div>
      <div className="grid grid-cols-2 gap-1.5 px-3 pb-3">
        <ActionButton
          colorClass=""
          disabled={disabled}
          onClick={onPrintCurrent}
        >
          <Printer size={19} className="shrink-0 rounded-md bg-blue-50 p-1 text-blue-700" />
          Imprimir actual
        </ActionButton>
        <ActionButton
          colorClass=""
          disabled={disabled}
          onClick={onPrintAll}
        >
          <FileStack size={19} className="shrink-0 rounded-md bg-cyan-50 p-1 text-cyan-700" />
          Imprimir todas
        </ActionButton>
        <ActionButton
          colorClass=""
          disabled={disabled || isExportingPdf}
          onClick={onDownloadPDFCurrent}
        >
          {isExportingPdf ? <LoaderCircle size={19} className="shrink-0 animate-spin rounded-md bg-violet-50 p-1 text-violet-700" /> : <Download size={19} className="shrink-0 rounded-md bg-violet-50 p-1 text-violet-700" />}
          PDF actual
        </ActionButton>
        <ActionButton
          colorClass=""
          disabled={disabled || isExportingPdf}
          onClick={onDownloadPDFAll}
        >
          {isExportingPdf ? <LoaderCircle size={19} className="shrink-0 animate-spin rounded-md bg-fuchsia-50 p-1 text-fuchsia-700" /> : <FileStack size={19} className="shrink-0 rounded-md bg-fuchsia-50 p-1 text-fuchsia-700" />}
          PDF todas
        </ActionButton>
      </div>
    </section>
  )
}

export default ActionPanel
