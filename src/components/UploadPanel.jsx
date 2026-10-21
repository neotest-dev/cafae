import { FileSpreadsheet, LoaderCircle, Upload } from 'lucide-react'

function UploadPanel({ fileName, isLoading, onFileChange, period }) {
  return (
    <section className="w-full min-w-0 space-y-1.5">
      <label className="block text-xs font-semibold text-slate-700">Archivo Excel</label>
      <div className="flex w-full min-w-0 items-center gap-2">
        <div className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5">
          {isLoading ? <LoaderCircle size={16} className="shrink-0 animate-spin text-blue-600" /> : <FileSpreadsheet size={16} className="shrink-0 text-emerald-700" />}
          <span className="truncate text-xs text-slate-700" title={fileName || undefined}>
            {fileName || 'Ningún archivo seleccionado'}
          </span>
        </div>
        <label className="inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50">
          {isLoading ? <LoaderCircle size={15} className="animate-spin" /> : <Upload size={15} />}
          {isLoading ? 'Cargando' : 'Elegir'}
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
      </div>
      <p className="text-[11px] text-slate-500">Periodo: <strong className="font-medium text-slate-700">{period || 'pendiente'}</strong></p>
    </section>
  )
}

export default UploadPanel
