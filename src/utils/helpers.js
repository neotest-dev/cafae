export function separarNombre(nombre) {
  if (!nombre) return { apellidos: '', nombres: '' }

  const conectores = ['DE', 'DEL', 'LA', 'LAS', 'LOS', 'VDA']
  const partes = nombre.trim().split(/\s+/)

  const apellidos = []
  let i = 0

  apellidos.push(partes[i++])
  if (i < partes.length) apellidos.push(partes[i++])

  while (i < partes.length && conectores.includes(partes[i].toUpperCase())) {
    apellidos.push(partes[i++])

    if (i < partes.length) {
      apellidos.push(partes[i++])
    }
  }

  return {
    apellidos: apellidos.join(' '),
    nombres: partes.slice(i).join(' '),
  }
}

export function formatearFecha(valor) {
  if (!valor) return '00/00/00'

  if (typeof valor === 'string') {
    return valor.trim()
  }

  if (typeof valor === 'number') {
    const fecha = new Date((valor - 25569) * 86400 * 1000)

    const dia = String(fecha.getDate()).padStart(2, '0')
    const mes = String(fecha.getMonth() + 1).padStart(2, '0')
    const anio = fecha.getFullYear()

    return `${dia}/${mes}/${anio}`
  }

  return '00/00/00'
}

export function nroBoleta(n) {
  return String(n).padStart(8, '0')
}

export function formatMonto(val) {
  const n = parseFloat((val || '0').toString().replace(/,/g, ''))
  return Number.isNaN(n) ? '0.00' : n.toFixed(2)
}
