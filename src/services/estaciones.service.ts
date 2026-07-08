import type { Estacion, Itinerario, EstacionItinerario } from '../types/index.ts'
import estaciones from '../data/estaciones.ts'
import { itinerarios, estacionesItinerarios } from '../data/itinerarios.ts'

// Simular el delay de una llamada a una API real
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function getEstaciones(): Promise<Estacion[]> {
  await delay(1500)
  return estaciones
}

export async function getItinerarios(): Promise<Itinerario[]> {
  await delay(1500)
  return itinerarios
}

export async function getEstacionesItinerarios(): Promise<EstacionItinerario[]> {
  await delay(1000)
  return estacionesItinerarios
}
