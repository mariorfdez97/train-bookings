import type { Estacion } from '../types'

const estaciones: Estacion[] = [
  // Itinerario A: Madrid - Gijón
  { idEstacion: 1, nombre: 'Madrid' },
  { idEstacion: 2, nombre: 'Segovia' },
  { idEstacion: 3, nombre: 'Valladolid' },
  { idEstacion: 4, nombre: 'Palencia' },
  { idEstacion: 5, nombre: 'León' },
  { idEstacion: 6, nombre: 'Mieres' },
  { idEstacion: 7, nombre: 'Oviedo' },
  { idEstacion: 8, nombre: 'Gijón' },

  // Itinerario B: Madrid - Sevilla (Madrid ya existe, id=1)
  { idEstacion: 9, nombre: 'Ciudad Real' },
  { idEstacion: 10, nombre: 'Puertollano' },
  { idEstacion: 11, nombre: 'Córdoba' },
  { idEstacion: 12, nombre: 'Sevilla' },

  // Itinerario C: Madrid - Elche
  { idEstacion: 13, nombre: 'Cuenca' },
  { idEstacion: 14, nombre: 'Albacete' },
  { idEstacion: 15, nombre: 'Villena' },
  { idEstacion: 16, nombre: 'Alicante' },
  { idEstacion: 17, nombre: 'Elche' },
]

export default estaciones
