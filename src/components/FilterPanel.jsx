import { FilterIcon, XIcon } from './Icons'

function FilterPanel({
  establishments,
  selectedEstablishment,
  searchText,
  onSearchTextChange,
  onSelect,
}) {
  return (
    <section className="h-full rounded-[1.6rem] border border-slate-200 bg-white p-4 shadow-md shadow-slate-200/60">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-900">
            Filtrar por Establecimiento
          </h3>
          <p className="mt-1 text-[11px] leading-5 text-slate-500">
            Reduce la lista por texto o por selección directa.
          </p>
        </div>
        <div className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
          Filtro
        </div>
      </div>

      <div className="rounded-[1.4rem] border border-slate-200 bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] p-3 shadow-inner shadow-slate-200/50">
        <div className="relative">
          <FilterIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchText}
            onChange={(event) => onSearchTextChange(event.target.value)}
            placeholder="Buscar establecimiento..."
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-9 pr-9 text-sm font-semibold text-slate-800 outline-none transition focus:ring-2 focus:ring-blue-500/20"
          />
          {searchText ? (
            <button
              type="button"
              onClick={() => onSearchTextChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
            >
              <XIcon className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        <select
          value={selectedEstablishment}
          onChange={(event) => onSelect(event.target.value)}
          className="mt-3 w-full cursor-pointer rounded-[1rem] border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
        >
          <option value="TODOS">MOSTRAR TODOS</option>
          {establishments.map((establishment) => (
            <option key={establishment} value={establishment}>
              {establishment}
            </option>
          ))}
        </select>
      </div>
    </section>
  )
}

export default FilterPanel
