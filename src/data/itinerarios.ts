import type { Itinerario, EstacionItinerario } from '../types'

export const itinerarios: Itinerario[] = [
  { idItinerario: 1, descripcion: 'Madrid - Gijón' },
  { idItinerario: 2, descripcion: 'Madrid - Sevilla' },
  { idItinerario: 3, descripcion: 'Madrid - Elche' },
]

// Relación estación-itinerario con orden y minutos entre paradas (en AVE)
// Los tiempos de Alvia son x1.5 (se calculan en el servicio, no aquí)
export const estacionesItinerarios: EstacionItinerario[] = [
  // Itinerario A: Madrid - Gijón
  { idItinerario: 1, idEstacion: 1, orden: 1, minutosHastaSiguiente: 30 },  // Madrid -> Segovia
  { idItinerario: 1, idEstacion: 2, orden: 2, minutosHastaSiguiente: 35 },  // Segovia -> Valladolid
  { idItinerario: 1, idEstacion: 3, orden: 3, minutosHastaSiguiente: 20 },  // Valladolid -> Palencia
  { idItinerario: 1, idEstacion: 4, orden: 4, minutosHastaSiguiente: 30 },  // Palencia -> León
  { idItinerario: 1, idEstacion: 5, orden: 5, minutosHastaSiguiente: 30 },  // León -> Mieres
  { idItinerario: 1, idEstacion: 6, orden: 6, minutosHastaSiguiente: 15 },  // Mieres -> Oviedo
  { idItinerario: 1, idEstacion: 7, orden: 7, minutosHastaSiguiente: 20 },  // Oviedo -> Gijón
  { idItinerario: 1, idEstacion: 8, orden: 8, minutosHastaSiguiente: null }, // Gijón (última)

  // Itinerario B: Madrid - Sevilla
  { idItinerario: 2, idEstacion: 1,  orden: 1, minutosHastaSiguiente: 45 },  // Madrid -> Ciudad Real
  { idItinerario: 2, idEstacion: 9,  orden: 2, minutosHastaSiguiente: 15 },  // Ciudad Real -> Puertollano
  { idItinerario: 2, idEstacion: 10, orden: 3, minutosHastaSiguiente: 30 },  // Puertollano -> Córdoba
  { idItinerario: 2, idEstacion: 11, orden: 4, minutosHastaSiguiente: 30 },  // Córdoba -> Sevilla
  { idItinerario: 2, idEstacion: 12, orden: 5, minutosHastaSiguiente: null }, // Sevilla (última)

  // Itinerario C: Madrid - Elche
  { idItinerario: 3, idEstacion: 1,  orden: 1, minutosHastaSiguiente: 40 },  // Madrid -> Cuenca
  { idItinerario: 3, idEstacion: 13, orden: 2, minutosHastaSiguiente: 40 },  // Cuenca -> Albacete
  { idItinerario: 3, idEstacion: 14, orden: 3, minutosHastaSiguiente: 30 },  // Albacete -> Villena
  { idItinerario: 3, idEstacion: 15, orden: 4, minutosHastaSiguiente: 15 },  // Villena -> Alicante
  { idItinerario: 3, idEstacion: 16, orden: 5, minutosHastaSiguiente: 10 },  // Alicante -> Elche
  { idItinerario: 3, idEstacion: 17, orden: 6, minutosHastaSiguiente: null }, // Elche (última)
]
