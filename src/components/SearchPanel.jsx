import { useState } from 'react'
import { SearchIcon } from './Icons'

function ModeButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] transition ${
        active
          ? 'bg-slate-900 text-white shadow-sm'
          : 'bg-white text-slate-500 hover:bg-slate-100'
      }`}
    >
      {children}
    </button>
  )
}

function SearchPanel({ onSearch }) {
  const [query, setQuery] = useState('')
  const [mode, setMode] = useState('dni')
  const [hasError, setHasError] = useState(false)

  function handleSearch() {
    const found = onSearch(query, mode)
    if (found) {
      setHasError(false)
      return
    }

    setHasError(true)
    window.setTimeout(() => setHasError(false), 1500)
  }

  const placeholder = mode === 'name' ? 'Apellidos y nombres...' : 'DNI...'
  const helperText = mode === 'name'
    ? 'Busca por coincidencia parcial del nombre completo.'
    : 'Salta directo a una boleta con el DNI.'

  return (
    <section className="h-full rounded-[1.6rem] border border-slate-200 bg-white p-4 shadow-md shadow-slate-200/60">
      <div className="mb-3 flex flex-col gap-3">
        <div>
          <h3 className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-900">
            Búsqueda Rápida
          </h3>
          <p className="mt-1 text-[11px] leading-5 text-slate-500">
            {helperText}
          </p>
        </div>
        <div className="flex w-fit shrink-0 rounded-full border border-slate-200 bg-slate-100 p-1">
          <ModeButton active={mode === 'dni'} onClick={() => setMode('dni')}>
            DNI
          </ModeButton>
          <ModeButton active={mode === 'name'} onClick={() => setMode('name')}>
            Nombre
          </ModeButton>
        </div>
      </div>

      <div className="relative rounded-[1.2rem] border border-slate-200 bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] p-2.5 shadow-inner shadow-slate-200/50">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') handleSearch()
          }}
          placeholder={hasError ? 'No encontrado' : placeholder}
          className={`w-full rounded-[1rem] border bg-white py-3 pl-11 pr-14 text-sm font-semibold text-slate-800 outline-none transition ${
            hasError
              ? 'border-red-400 ring-4 ring-red-500/10'
              : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
          }`}
        />
        <button
          type="button"
          onClick={handleSearch}
          className={`absolute right-2.5 top-1/2 -translate-y-1/2 rounded-[0.95rem] p-3 text-white shadow-md transition ${
            hasError ? 'bg-red-500 shadow-red-200' : 'bg-blue-600 shadow-blue-200 hover:bg-blue-700'
          }`}
        >
          <SearchIcon className="h-5 w-5" />
        </button>
      </div>
    </section>
  )
}

export default SearchPanel
