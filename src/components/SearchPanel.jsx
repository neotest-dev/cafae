import { useState } from 'react'
import { Search } from 'lucide-react'

function ModeButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
        active
          ? 'bg-white text-blue-700 shadow-sm'
          : 'text-slate-500 hover:text-slate-800'
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
    <section className="w-full min-w-0 space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <label className="text-xs font-semibold text-slate-700">Buscar registro</label>
        <div className="flex shrink-0 rounded-lg bg-slate-100 p-0.5">
          <ModeButton active={mode === 'dni'} onClick={() => setMode('dni')}>
            DNI
          </ModeButton>
          <ModeButton active={mode === 'name'} onClick={() => setMode('name')}>
            Nombre
          </ModeButton>
        </div>
      </div>

      <div className="flex w-full min-w-0 gap-2">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') handleSearch()
          }}
          placeholder={hasError ? 'No encontrado' : placeholder}
          className={`h-10 w-0 min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 ${
            hasError
              ? '!border-red-500 !bg-red-50'
              : ''
          }`}
        />
        <button
          type="button"
          onClick={handleSearch}
          className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-semibold shadow-sm transition ${
            hasError ? 'bg-red-50 text-red-700 ring-1 ring-red-200' : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <Search size={16} /> Buscar
        </button>
      </div>
      <p className="text-[11px] text-slate-500">{helperText}</p>
    </section>
  )
}

export default SearchPanel
