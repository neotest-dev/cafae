import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from './Icons'

function NavigationButton({ children, disabled, onClick }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-600 transition hover:border-slate-300 hover:bg-slate-900 hover:text-white hover:shadow-md disabled:opacity-30"
    >
      {children}
    </button>
  )
}

function NavigationPanel({ canGoFirst, canGoLast, canGoNext, canGoPrevious, onFirst, onLast, onNext, onPrevious, regActual }) {
  return (
    <section className="h-full rounded-[1.6rem] border border-slate-200 bg-white p-4 shadow-md shadow-slate-200/60">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-900">
            Navegación
          </h3>
          <p className="mt-1 text-[11px] leading-5 text-slate-500">
            Muévete entre registros filtrados.
          </p>
        </div>
        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600">
          {regActual}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <NavigationButton disabled={!canGoFirst} onClick={onFirst}>
          <ChevronsLeftIcon className="mx-auto h-5 w-5" />
        </NavigationButton>
        <NavigationButton disabled={!canGoPrevious} onClick={onPrevious}>
          <ChevronLeftIcon className="mx-auto h-5 w-5" />
        </NavigationButton>
        <NavigationButton disabled={!canGoNext} onClick={onNext}>
          <ChevronRightIcon className="mx-auto h-5 w-5" />
        </NavigationButton>
        <NavigationButton disabled={!canGoLast} onClick={onLast}>
          <ChevronsRightIcon className="mx-auto h-5 w-5" />
        </NavigationButton>
      </div>
    </section>
  )
}

export default NavigationPanel
