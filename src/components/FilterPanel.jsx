import { useState } from 'react'
import { Check, ChevronDown, Filter, X } from 'lucide-react'

function FilterPanel({
  establishments,
  selectedEstablishment,
  searchText,
  onSearchTextChange,
  onSelect,
}) {
  const [isOpen, setIsOpen] = useState(false)

  function chooseEstablishment(value) {
    onSelect(value)
    setIsOpen(false)
  }

  return (
    <section className="w-full min-w-0 space-y-1.5">
      <label className="block text-xs font-semibold text-slate-700">Filtrar establecimiento</label>
      <div className="grid min-w-0 gap-2">
        <div className="relative">
          <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchText}
            onChange={(event) => onSearchTextChange(event.target.value)}
            placeholder="Buscar establecimiento..."
            className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-9 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          />
          {searchText ? (
            <button
              type="button"
              onClick={() => onSearchTextChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Limpiar filtro"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        <div
          className="relative min-w-0"
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false)
          }}
          onKeyDown={(event) => {
            if (event.key === 'Escape') setIsOpen(false)
          }}
        >
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((open) => !open)}
            className="flex h-10 w-full min-w-0 items-center justify-between gap-2 rounded-lg border border-slate-300 bg-white px-3 text-left text-sm text-slate-700 transition hover:border-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
          >
            <span className="truncate">{selectedEstablishment === 'TODOS' ? 'Todos los establecimientos' : selectedEstablishment}</span>
            <ChevronDown size={16} className={`shrink-0 text-slate-400 transition ${isOpen ? 'rotate-180' : ''}`} />
          </button>
          {isOpen ? (
            <div
              role="listbox"
              aria-label="Establecimientos disponibles"
              className="absolute inset-x-0 top-[calc(100%+6px)] z-30 max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10"
            >
              <button
                type="button"
                role="option"
                aria-selected={selectedEstablishment === 'TODOS'}
                onClick={() => chooseEstablishment('TODOS')}
                className={`flex min-h-9 w-full items-center justify-between gap-2 rounded-lg px-2.5 text-left text-sm transition hover:bg-slate-50 ${selectedEstablishment === 'TODOS' ? 'bg-blue-50 font-semibold text-blue-700' : 'text-slate-700'}`}
              >
                <span>Todos los establecimientos</span>
                {selectedEstablishment === 'TODOS' ? <Check size={15} /> : null}
              </button>
              {establishments.map((establishment) => (
                <button
                  key={establishment}
                  type="button"
                  role="option"
                  aria-selected={selectedEstablishment === establishment}
                  onClick={() => chooseEstablishment(establishment)}
                  title={establishment}
                  className={`flex min-h-9 w-full items-center justify-between gap-2 rounded-lg px-2.5 text-left text-sm transition hover:bg-slate-50 ${selectedEstablishment === establishment ? 'bg-blue-50 font-semibold text-blue-700' : 'text-slate-700'}`}
                >
                  <span className="truncate">{establishment}</span>
                  {selectedEstablishment === establishment ? <Check size={15} className="shrink-0" /> : null}
                </button>
              ))}
              {establishments.length === 0 ? (
                <p className="px-2.5 py-3 text-xs text-slate-500">No hay establecimientos con ese texto.</p>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default FilterPanel
