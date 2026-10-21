import { formatearFecha } from './helpers.js'

const MESES = {
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

function normalizarTexto(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
}

function extraerFechaTexto(fileName, workbook) {
  const numericMatch = fileName.match(/(\d{4})[-_ ]?(0[1-9]|1[0-2])\b/)
  if (numericMatch) return `${MESES[numericMatch[2]]} - ${numericMatch[1]}`

  const monthNames = Object.values(MESES).join('|')
  const monthMatch = `${fileName} ${workbook.SheetNames.join(' ')}`
    .toUpperCase()
    .match(new RegExp(`\\b(${monthNames})\\b[^0-9]{0,12}(20\\d{2})`))

  if (monthMatch) return `${monthMatch[1]} - ${monthMatch[2]}`

  for (const sheet of Object.values(workbook.Sheets)) {
    const title = XLSXText(sheet)
    const titleMatch = title.match(new RegExp(`\\b(${monthNames})\\b[^0-9]{0,12}(20\\d{2})`))
    if (titleMatch) return `${titleMatch[1]} - ${titleMatch[2]}`
  }

  const yearMatch = fileName.match(/\b(20\d{2})\b/)
  return yearMatch ? `MES - ${yearMatch[1]}` : 'MES - AÑO'
}

function XLSXText(sheet) {
  return Object.values(sheet)
    .filter((cell) => cell && typeof cell.v === 'string')
    .map((cell) => cell.v)
    .join(' ')
}

function buscarColumnas(rows) {
  const limite = Math.min(rows.length, 15)

  for (let rowIndex = 0; rowIndex < limite; rowIndex += 1) {
    const headers = rows[rowIndex].map(normalizarTexto)
    const find = (...names) => headers.findIndex((header) => names.includes(header))
    const columns = {
      numero: find('NRO', 'NUMERO', 'NUMEROBOLETA'),
      codigo: find('CODIGO', 'CODIGOMODULAR', 'CODMOD'),
      dni: find('DNI'),
      apellidoPaterno: find('APELLIDOPATERNO', 'PATERNO', 'APEPAT'),
      apellidoMaterno: find('APELLIDOMATERNO', 'MATERNO', 'APEMAT'),
      apellido: find('APELLIDOS', 'ADMINISTRATIVO'),
      nombres: find('NOMBRES', 'NOMBRE'),
      nivel: find('NIVEL'),
      codigoEstablecimiento: find('CODESTABLECIMIENTO', 'CODIGOESTABLECIMIENTO'),
      cargoCodigo: find('CCARGO', 'CODIGOCARGO'),
      establecimiento: find('ESTABLECIMIENTO', 'COLEGIO'),
      cargo: find('CARGO'),
      tipoServidor: find('TIPODESERVIDOR', 'TIPOSERVIDOR', 'TIPOSERV'),
      categoria: find('CATREM', 'CATREMUN', 'CATEGORIAREMUNERATIVA'),
      cuenta: find('CTABANCO', 'CTA', 'CUENTA', 'CUENTABANCARIA'),
      monto: find('MONTO', 'MONTOAPAGAR'),
      observaciones: find('OBSERVACION', 'OBSERVACIONES', 'OBS'),
      fechaNacimiento: find('FECHANACIMIENTO', 'FECNAC'),
    }

    if (columns.codigo >= 0 && columns.dni >= 0 && columns.nombres >= 0
      && (columns.apellidoPaterno >= 0 || columns.apellido >= 0)) {
      return { headerRow: rowIndex, columns }
    }
  }

  return null
}

function valor(row, index) {
  return index >= 0 ? row[index] : ''
}

function texto(valorCelda) {
  return String(valorCelda ?? '').trim()
}

function mapearPorEncabezados(rows, headerRow, columns) {
  return rows.slice(headerRow + 1)
    .map((row, index) => {
      const apellidos = columns.apellidoPaterno >= 0
        ? [valor(row, columns.apellidoPaterno), valor(row, columns.apellidoMaterno)]
          .map(texto)
          .filter(Boolean)
          .join(' ')
        : texto(valor(row, columns.apellido))
      const nombres = texto(valor(row, columns.nombres))
      const codigo = texto(valor(row, columns.codigo))
      const dni = texto(valor(row, columns.dni))

      return {
        NumeroBoleta: Number(valor(row, columns.numero)) || index + 1,
        CodigoModular: codigo,
        DNI: dni,
        ADMINISTRATIVO: [apellidos, nombres].filter(Boolean).join(' '),
        Nivel: valor(row, columns.nivel),
        Cod_Establecimiento: valor(row, columns.codigoEstablecimiento),
        C_Cargo: valor(row, columns.cargoCodigo),
        Establecimiento: valor(row, columns.establecimiento),
        Cargo: valor(row, columns.cargo),
        CAT_REM: valor(row, columns.categoria),
        TipoServidor: valor(row, columns.tipoServidor),
        CTA: valor(row, columns.cuenta),
        MONTO: valor(row, columns.monto),
        OBS: valor(row, columns.observaciones),
        FechaNacimiento: columns.fechaNacimiento >= 0
          ? formatearFecha(valor(row, columns.fechaNacimiento))
          : '00/00/00',
      }
    })
    .filter((record) => record.CodigoModular && record.DNI && record.ADMINISTRATIVO)
}

function buscarHojaCompatible(workbook, XLSX) {
  const preferredNames = workbook.SheetNames.filter((name) => {
    const normalized = normalizarTexto(name)
    return normalized.includes('IMPRADM') || normalized.includes('LISTADOABONOIMP')
  })

  let legacySheet
  for (const name of preferredNames) {
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[name], {
      header: 1,
      raw: false,
      defval: '',
    })
    const schema = buscarColumnas(rows)
    if (schema) return { name, rows, schema }
    if (normalizarTexto(name).includes('IMPRADM')) legacySheet = { name, rows, schema: null }
  }

  if (legacySheet) return legacySheet

  for (const name of workbook.SheetNames) {
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[name], {
      header: 1,
      raw: false,
      defval: '',
    })
    const schema = buscarColumnas(rows)
    if (schema) return { name, rows, schema }
  }

  return null
}

function leerArchivoComoBinario(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => resolve(event.target.result)
    reader.onerror = () => reject(new Error('No se pudo leer el archivo Excel.'))

    reader.readAsBinaryString(file)
  })
}

export function parseExcelWorkbook(workbook, fileName, XLSX) {
  const match = buscarHojaCompatible(workbook, XLSX)
  if (!match) {
    throw new Error(`No se encontró una hoja compatible. Hojas disponibles: ${workbook.SheetNames.join(', ')}`)
  }

  const fechaTexto = extraerFechaTexto(fileName, workbook)
  if (match.schema) {
    const data = mapearPorEncabezados(match.rows, match.schema.headerRow, match.schema.columns)
    if (data.length === 0) {
      throw new Error(`Se encontró la hoja '${match.name}', pero no contiene registros válidos.`)
    }
    return { data, fechaTexto }
  }

  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[match.name], {
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
    .filter((record) => record.CodigoModular && record.ADMINISTRATIVO)

  return { data, fechaTexto }
}

export async function parseExcelFile(file) {
  const XLSX = await import('xlsx')
  const binary = await leerArchivoComoBinario(file)
  const workbook = XLSX.read(binary, {
    type: 'binary',
    cellDates: true,
    dateNF: 'dd/mm/yyyy',
  })

  return parseExcelWorkbook(workbook, file.name, XLSX)
}
