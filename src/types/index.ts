// Modelos de datos de la app
// Siguiendo la estructura del ejercicio, modelamos como si fueran tablas de BD

export interface Estacion {
  idEstacion: number
  nombre: string
}

export interface Itinerario {
  idItinerario: number
  descripcion: string // ej: "Madrid - Gijón"
}

// Relación entre estaciones e itinerarios (qué estaciones pertenecen a qué itinerario)
// También guardamos el orden y el tiempo hasta la siguiente estación
export interface EstacionItinerario {
  idItinerario: number
  idEstacion: number
  orden: number        // posición en el itinerario (1, 2, 3...)
  minutosHastaSiguiente: number | null  // null si es la última estación
}

export type TipoTren = 'AVE' | 'ALVIA'

export interface TipoTrenConfig {
  tipo: TipoTren
  numVagones: number
  filasPorVagon: number
  asientosPorFila: number
  precioBase: number
  tarifaInicial: number   // €/min para el primer tramo
  decrementoPorTramo: number  // cuánto baja la tarifa en cada tramo
  tarifaMinima: number    // tarifa mínima €/min
  factorTiempo: number    // multiplicador del tiempo respecto al AVE (AVE=1, ALVIA=1.5)
}

// Una "salida" concreta de un tren en un itinerario
export interface FrecuenciaTren {
  idFrecuencia: number
  idItinerario: number
  tipo: TipoTren
  horaSalida: string  // formato "HH:MM", hora de salida desde la primera estación
}
