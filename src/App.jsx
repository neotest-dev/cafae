import { useState } from 'react'
import ActionPanel from './components/ActionPanel'
import BoletaPreview from './components/BoletaPreview'
import FilterPanel from './components/FilterPanel'
import Header from './components/Header'
import NavigationPanel from './components/NavigationPanel'
import SearchPanel from './components/SearchPanel'
import Toast from './components/Toast'
import UploadPanel from './components/UploadPanel'
import { useBoletas } from './hooks/useBoletas'

function App() {
  const [previewIsDragging, setPreviewIsDragging] = useState(false)

  const {
    currentBoleta,
    dataFiltrada,
    downloadAllPDF,
    downloadCurrentPDF,
    establecimientosVisibles,
    establecimientoSeleccionado,
    fechaTexto,
    fileName,
    highlightDniSignal,
    index,
    isExportingPdf,
    isLoading,
    loadExcel,
    next,
    previous,
    goTo,
    printAll,
    printCurrent,
    recordCount,
    regActual,
    searchRecords,
    selectedEstablishmentText,
    setEstablishmentText,
    setSelectedEstablishment,
    toast,
    closeToast,
    resetCurrentBoleta,
    updateCurrentBoleta,
  } = useBoletas()

  const hasData = dataFiltrada.length > 0
  const esPrimero = index === 0
  const esUltimo = index === dataFiltrada.length - 1 || dataFiltrada.length === 0
  const esFiltroActivo = establecimientoSeleccionado !== 'TODOS'

  return (
    <div className="min-h-screen bg-slate-100 p-0 text-slate-800 sm:p-2">
      <div className="mx-auto flex min-h-screen w-full max-w-[1800px] flex-col overflow-hidden rounded-none border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,38,64,0.1)] sm:h-[calc(100dvh-1rem)] sm:min-h-0 sm:rounded-xl">
        <Header period={fechaTexto} recordCount={recordCount} />

        <main className="grid min-h-0 w-full flex-1 grid-cols-1 gap-3 bg-slate-50 p-3 sm:p-4 lg:grid-cols-[minmax(0,1fr)_350px] lg:overflow-hidden">
          <BoletaPreview
            boletaHtml={currentBoleta}
            fileName={fileName}
            highlightDniSignal={highlightDniSignal}
            isLoading={isLoading}
            onBoletaChange={updateCurrentBoleta}
            onFileChange={loadExcel}
            onResetBoleta={resetCurrentBoleta}
            previewIsDragging={previewIsDragging}
            setPreviewIsDragging={setPreviewIsDragging}
          />

          <aside className="order-1 grid min-h-0 w-full min-w-0 grid-cols-1 content-start gap-2.5 overflow-y-auto lg:order-2 lg:flex lg:flex-col lg:overflow-y-auto">
            <section className="grid w-full min-w-0 grid-cols-[minmax(0,1fr)] gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm lg:shrink-0">
              <h2 className="border-b border-slate-100 pb-2 text-sm font-semibold text-slate-800">
                Opciones de consulta
              </h2>
              <UploadPanel
                fileName={fileName}
                isLoading={isLoading}
                onFileChange={loadExcel}
                period={fechaTexto}
              />
              <SearchPanel onSearch={searchRecords} />
              <FilterPanel
                establishments={establecimientosVisibles}
                selectedEstablishment={establecimientoSeleccionado}
                searchText={selectedEstablishmentText}
                onSearchTextChange={setEstablishmentText}
                onSelect={setSelectedEstablishment}
              />
            </section>
            <NavigationPanel
              canGoFirst={hasData && !esPrimero && !esFiltroActivo}
              canGoLast={hasData && !esUltimo && !esFiltroActivo}
              canGoNext={hasData && !esUltimo}
              canGoPrevious={hasData && !esPrimero}
              onFirst={() => goTo(0)}
              onLast={() => goTo(dataFiltrada.length - 1)}
              onNext={next}
              onPrevious={previous}
              regActual={regActual}
            />
            <ActionPanel
              disabled={!hasData}
              isExportingPdf={isExportingPdf}
              onDownloadPDFAll={downloadAllPDF}
              onDownloadPDFCurrent={downloadCurrentPDF}
              onPrintAll={printAll}
              onPrintCurrent={printCurrent}
            />
          </aside>
        </main>

      </div>

      <Toast message={toast?.message} onClose={closeToast} type={toast?.type} />
    </div>
  )
}

export default App
