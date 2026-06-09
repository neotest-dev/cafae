import { FileTextIcon, LoaderIcon, UploadIcon } from './Icons'

function UploadPanel({ fileName, isLoading, onFileChange, period }) {
  return (
    <section className="h-full rounded-[1.6rem] border border-slate-200 bg-white p-4 shadow-md shadow-slate-200/60">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-900">
            Archivo y Periodo
          </h3>
          <p className="mt-1 text-[11px] font-medium text-slate-500">
            {period || 'Sin periodo detectado'}
          </p>
        </div>
        <div className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
          Excel
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
            {isLoading ? <LoaderIcon className="h-5 w-5 animate-spin" /> : <FileTextIcon className="h-5 w-5" />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              Archivo actual
            </p>
            <p className="min-h-[3.5rem] break-words text-[13px] font-semibold leading-6 text-slate-700">
              {fileName || 'Aun no has cargado un Excel'}
            </p>
          </div>
        </div>

        <label className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-xs font-extrabold uppercase tracking-[0.14em] text-white transition hover:bg-black">
          {isLoading ? <LoaderIcon className="h-4 w-4 animate-spin" /> : <UploadIcon className="h-4 w-4" />}
          {isLoading ? 'Procesando...' : 'Cargar Excel'}
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
    </section>
  )
}

export default UploadPanel
