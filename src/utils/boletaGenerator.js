import { formatMonto, nroBoleta, separarNombre } from './helpers'

export const BOLETA_SEPARATOR = '='.repeat(78)
export const BOLETA_DASH_SEPARATOR = '-'.repeat(78)
const SELLO_URL = `${import.meta.env.BASE_URL}SELLO.png`

function line(label, value, field) {
  const content = `${label}     :     ${value}`
  return field
    ? `<span data-boleta-field="${field}">${content}</span>`
    : content
}

export function getBoletaData(d, fechaTexto) {
  const persona = separarNombre(d.ADMINISTRATIVO)
  const monto = formatMonto(d.MONTO)
  const nro = nroBoleta(d.NumeroBoleta)

  return {
    nro,
    fechaTexto,
    codigoEstablecimiento: d.Cod_Establecimiento || '250001',
    codigoModular: d.CodigoModular,
    codigoCargo: d.C_Cargo || 'B9012027-0822668',
    apellidos: persona.apellidos,
    nombres: persona.nombres,
    dni: d.DNI || '',
    fechaNacimiento: d.FechaNacimiento || '',
    establecimiento: d.Establecimiento || '',
    cargo: d.Cargo || '',
    categoriaRem:
      d.CAT_REM ? `${d.CAT_REM.toString().split('').join('-')}-40` : '',
    tipoServidor: d.TipoServidor || '',
    cuenta: d.CTA || '',
    observaciones: d.OBS || '',
    monto,
  }
}

export function generarBoleta(d, fechaTexto) {
  const boleta = getBoletaData(d, fechaTexto)

  return `BOLETA  N°${boleta.nro}
MINISTERIO DE EDUCACION
GERENCIA REGIONAL DE EDUCACION LA LIBERTAD                                   ${boleta.codigoEstablecimiento}
UGEL 04 TRUJILLO SUR ESTE
${boleta.fechaTexto}
RUC 20539858077
CODIGO MODULAR: ${boleta.codigoModular}                                         ${boleta.codigoCargo}
${line('APELLIDOS              ', boleta.apellidos, 'apellidos-line')}
${line('NOMBRES                ', boleta.nombres, 'nombres-line')}
${line('DNI                    ', boleta.dni, 'dni-line')}
${line('FECHA DE NACIMIENTO    ', boleta.fechaNacimiento)}
${line('ESTABLECIMIENTO        ', boleta.establecimiento)}
${line('CARGO                  ', boleta.cargo)}
${line('G. OCUPACIONAL/NIV-REM ', boleta.categoriaRem)}
${line('TIPO DE SERVIDOR       ', boleta.tipoServidor)}
${line('REGIMEN                ', 'DL.276')}
${line('Cta. Ahorro            ', boleta.cuenta)}
Leyenda Mensual         :
${BOLETA_SEPARATOR}
<div style="display: flex; justify-content: space-between; width: 85%; font-family: 'JetBrains Mono', monospace;">
<span>INCENTIVO UNICO</span>
<span>S/. ${boleta.monto}</span>
</div>
<div class="boleta-sello" data-boleta-sello="true"><img src="${SELLO_URL}" alt="Sello y firma de visto bueno" /></div>
${BOLETA_SEPARATOR}

Leyenda:
* Ley No 29874 Art. 4.
* Decreto Supremo No 104-2012-EF
* Ley 29951 CENTESIMA CUARTA DISPOSICION COMPLEMENTARIA Y FINAL
${BOLETA_DASH_SEPARATOR}
Observaciones: ${boleta.observaciones}`
}

export function generarDocumentoImpresion(contenido) {
  return `
    <html>
      <head>
        <title>Boleta</title>
        <style>
          body {
            font-family: "JetBrains Mono", monospace;
            font-size: 11pt;
            color: #000;
            margin: 20px;
            line-height: 1.6;
            font-weight: 700;
            white-space: pre;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            overflow-y: auto;
          }
          div { position: relative; }
          span { color: #000; }
          .boleta-sello {
            display: flex;
            width: 85%;
            height: 32mm;
            align-items: center;
            justify-content: center;
          }
          .boleta-sello img {
            display: block;
            width: 80mm;
            max-width: 100%;
            height: auto;
            object-fit: contain;
          }
          @media print {
            body { margin: 10px; }
            img { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .pagina { page-break-after: always; }
          }
        </style>
      </head>
      <body>${contenido}</body>
    </html>
  `
}
