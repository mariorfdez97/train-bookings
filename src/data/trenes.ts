import type { TipoTrenConfig, FrecuenciaTren } from '../types'

//Configuración del tipo de tren

export const configTrenes: TipoTrenConfig[] = [
  {
    tipo: 'AVE',
    numVagones: 8,
    filasPorVagon: 15,
    asientosPorFila: 4,
    precioBase: 30,
    tarifaInicial: 0.20,      // €/min primer tramo
    decrementoPorTramo: 0.02, // baja 0.02 por cada tramo adicional
    tarifaMinima: 0.10,
    factorTiempo: 1,
  },
  {
    tipo: 'ALVIA',
    numVagones: 10,
    filasPorVagon: 9,
    asientosPorFila: 4,
    precioBase: 15,
    tarifaInicial: 0.15,
    decrementoPorTramo: 0.01,
    tarifaMinima: 0.05,
    factorTiempo: 1.5,        // tarda un 50% más que el AVE
  },
]

// Horarios de salida por itinerario y tipo de tren

export const frecuencias: FrecuenciaTren[] = [
  // Itinerario A - AVE: cada 3h de 9:00 a 15:00 (en ambas direcciones, aquí solo ida)
  { idFrecuencia: 1,  idItinerario: 1, tipo: 'AVE',   horaSalida: '09:00' },
  { idFrecuencia: 2,  idItinerario: 1, tipo: 'AVE',   horaSalida: '12:00' },
  { idFrecuencia: 3,  idItinerario: 1, tipo: 'AVE',   horaSalida: '15:00' },

  // Itinerario A - Alvia: a las 18:00, 23:00 y 04:00
  { idFrecuencia: 4,  idItinerario: 1, tipo: 'ALVIA', horaSalida: '18:00' },
  { idFrecuencia: 5,  idItinerario: 1, tipo: 'ALVIA', horaSalida: '23:00' },
  { idFrecuencia: 6,  idItinerario: 1, tipo: 'ALVIA', horaSalida: '04:00' },

  // Itinerario B - AVE: cada 2.5h de 8:00 a 23:00
  { idFrecuencia: 7,  idItinerario: 2, tipo: 'AVE',   horaSalida: '08:00' },
  { idFrecuencia: 8,  idItinerario: 2, tipo: 'AVE',   horaSalida: '10:30' },
  { idFrecuencia: 9,  idItinerario: 2, tipo: 'AVE',   horaSalida: '13:00' },
  { idFrecuencia: 10, idItinerario: 2, tipo: 'AVE',   horaSalida: '15:30' },
  { idFrecuencia: 11, idItinerario: 2, tipo: 'AVE',   horaSalida: '18:00' },
  { idFrecuencia: 12, idItinerario: 2, tipo: 'AVE',   horaSalida: '20:30' },
  { idFrecuencia: 13, idItinerario: 2, tipo: 'AVE',   horaSalida: '23:00' },

  // Itinerario C - AVE: cada 3h de 9:00 a 15:00
  { idFrecuencia: 14, idItinerario: 3, tipo: 'AVE',   horaSalida: '09:00' },
  { idFrecuencia: 15, idItinerario: 3, tipo: 'AVE',   horaSalida: '12:00' },
  { idFrecuencia: 16, idItinerario: 3, tipo: 'AVE',   horaSalida: '15:00' },

  // Itinerario C - Alvia: cada 6h de 10:30 a 04:30
  { idFrecuencia: 17, idItinerario: 3, tipo: 'ALVIA', horaSalida: '10:30' },
  { idFrecuencia: 18, idItinerario: 3, tipo: 'ALVIA', horaSalida: '16:30' },
  { idFrecuencia: 19, idItinerario: 3, tipo: 'ALVIA', horaSalida: '22:30' },
  { idFrecuencia: 20, idItinerario: 3, tipo: 'ALVIA', horaSalida: '04:30' },
]
