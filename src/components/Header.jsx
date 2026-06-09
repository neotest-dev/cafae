function Header({ period, recordCount }) {
  return (
    <header className="flex items-center justify-between gap-4 rounded-[1.6rem] border border-white/70 bg-white/80 px-4 py-3 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur">
      <div className="flex min-w-0 items-center gap-3">
        <div className="rounded-[1rem] border border-slate-200 bg-white p-2.5 shadow-sm">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Escudo_nacional_del_Per%C3%BA.png/1280px-Escudo_nacional_del_Per%C3%BA.png"
            alt="Escudo Nacional"
            className="h-11 w-auto object-contain"
          />
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-[1.9rem] font-black leading-none tracking-tight text-slate-900">
            CAFAE BOLETAS
          </h1>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-500">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              UGEL 04 TRUJILLO SUR ESTE
            </span>
            {period ? (
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-slate-600">
                {period}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="hidden shrink-0 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-black text-blue-700 sm:block">
        {recordCount} REGISTROS
      </div>
    </header>
  )
}

export default Header
