import { formatearFecha } from './helpers'

function extraerFechaTexto(fileName) {
  const match = fileName.match(/(\d{4})(\d{2})/)
  if (!match) return 'MES - AÑO'

  const anio = match[1]
  const mes = match[2]
  const meses = {
    '01': 'ENERO',
    '02': 'FEBRERO',
    '03': 'MARZO',
    '04': 'ABRIL',
    '05': 'MAYO',
    '06': 'JUNIO',
    '07': 'JULIO',
    '08': 'AGOSTO',
    '09': 'SETIEMBRE',
    '10': 'OCTUBRE',
    '11': 'NOVIEMBRE',
    '12': 'DICIEMBRE',
  }

  return `${meses[mes] || mes} - ${anio}`
}

function leerArchivoComoBinario(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => resolve(event.target.result)
    reader.onerror = () => reject(new Error('No se pudo leer el archivo Excel.'))

    reader.readAsBinaryString(file)
  })
}

export async function parseExcelFile(file) {
  const XLSX = await import('xlsx')
  const fechaTexto = extraerFechaTexto(file.name)
  const binary = await leerArchivoComoBinario(file)
  const workbook = XLSX.read(binary, {
    type: 'binary',
    cellDates: true,
    dateNF: 'dd/mm/yyyy',
  })

  const sheetName = workbook.SheetNames.find((n) => n.includes('IMPR ADM'))
  if (!sheetName) {
    throw new Error("No se encontró la hoja 'IMPR ADM' en el archivo.")
  }

  const sheet = workbook.Sheets[sheetName]
  const rows = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    raw: false,
  })

  const data = rows
    .slice(3)
    .map((row, i) => {
      const codigo = (row[1] || '').toString().trim()

      return {
        NumeroBoleta: i + 1,
        CodigoModular: codigo,
        DNI: codigo.length >= 8 ? codigo.slice(-8) : '',
        ADMINISTRATIVO: row[4],
        Nivel: row[3],
        Cod_Establecimiento: row[6],
        C_Cargo: row[2],
        Establecimiento: row[7],
        Cargo: row[8],
        CAT_REM: row[10],
        TipoServidor: row[9],
        CTA: row[11],
        MONTO: row[12],
        OBS: row[13],
        FechaNacimiento: formatearFecha(row[14]),
      }
    })
    .filter((d) => d.CodigoModular && d.ADMINISTRATIVO)

  return { data, fechaTexto }
}
