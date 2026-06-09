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
    <>
      <div className="h-2 w-full bg-gradient-to-r from-red-600 via-red-500 to-red-600" />

      <div className="mx-auto flex min-h-screen w-full max-w-[1400px] flex-col px-3 py-3 sm:px-4 md:px-5 xl:px-6">
        <Header period={fechaTexto} recordCount={recordCount} />

        <main className="mt-4 grid flex-1 grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_420px] xl:grid-cols-[minmax(0,760px)_540px]">
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

          <aside className="order-1 lg:order-2 lg:sticky lg:top-3 lg:w-full lg:justify-self-start">
            <div className="grid grid-cols-1 items-stretch gap-3 2xl:grid-cols-2">
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
              <div className="2xl:col-span-2">
                <ActionPanel
                  disabled={!hasData}
                  isExportingPdf={isExportingPdf}
                  onDownloadPDFAll={downloadAllPDF}
                  onDownloadPDFCurrent={downloadCurrentPDF}
                  onPrintAll={printAll}
                  onPrintCurrent={printCurrent}
                />
              </div>
            </div>
          </aside>
        </main>

        <footer className="mt-4 border-t border-slate-200 py-4 text-center">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">
            © 2026 • CAFAE - UGEL04 TSE
          </p>
        </footer>
      </div>

      <Toast message={toast?.message} onClose={closeToast} type={toast?.type} />
    </>
  )
}

export default App
