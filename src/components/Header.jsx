import { CalendarDays, Database } from 'lucide-react'

function Header({ period, recordCount }) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="flex min-h-[68px] items-center justify-between gap-3 border-t-4 border-t-blue-700 bg-white px-4 py-2 sm:px-6">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white p-1">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Escudo_nacional_del_Per%C3%BA.png/1280px-Escudo_nacional_del_Per%C3%BA.png"
              alt="Escudo Nacional del Perú"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="min-w-0 leading-tight">
            <h1 className="truncate text-lg font-bold tracking-tight text-slate-800">Sistema de Boletas CAFAE</h1>
            <p className="truncate text-xs font-medium uppercase tracking-[0.08em] text-slate-500">UGEL 04 Trujillo Sur Este</p>
          </div>
        </div>
        <div className="hidden items-center gap-2 text-sm font-bold text-slate-800 sm:flex">
          <span className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3.5 py-2.5">
            <Database size={16} className="text-blue-700" /> {recordCount} registros
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3.5 py-2.5">
            <CalendarDays size={16} className="text-amber-700" /> {period || 'Sin periodo'}
          </span>
        </div>
      </div>
    </header>
  )
}

export default Header
