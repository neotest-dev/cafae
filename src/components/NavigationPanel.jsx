import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

function NavigationButton({ children, disabled, label, onClick }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={label}
      title={label}
      className="classic-icon-button"
    >
      {children}
    </button>
  )
}

function NavigationPanel({ canGoFirst, canGoLast, canGoNext, canGoPrevious, onFirst, onLast, onNext, onPrevious, regActual, className = '' }) {
  return (
    <section className={`classic-panel ${className}`}>
      <div className="flex items-center justify-between gap-2 px-3 pb-2 pt-3">
        <span className="text-xs font-semibold text-slate-700">Navegación</span>
        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold tabular-nums text-blue-700">{regActual}</span>
      </div>
      <div className="grid grid-cols-4 gap-1.5 px-3 pb-3">
        <NavigationButton disabled={!canGoFirst} label="Primer registro" onClick={onFirst}>
          <ChevronsLeft className="mx-auto h-5 w-5" />
        </NavigationButton>
        <NavigationButton disabled={!canGoPrevious} label="Registro anterior" onClick={onPrevious}>
          <ChevronLeft className="mx-auto h-5 w-5" />
        </NavigationButton>
        <NavigationButton disabled={!canGoNext} label="Registro siguiente" onClick={onNext}>
          <ChevronRight className="mx-auto h-5 w-5" />
        </NavigationButton>
        <NavigationButton disabled={!canGoLast} label="Último registro" onClick={onLast}>
          <ChevronsRight className="mx-auto h-5 w-5" />
        </NavigationButton>
      </div>
    </section>
  )
}

export default NavigationPanel
