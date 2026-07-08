import { estacionesItinerarios } from '../data/itinerarios.ts'
import { configTrenes, frecuencias } from '../data/trenes.ts'

export interface Viaje {
  idViaje: string;
  tipoTren: 'AVE' | 'ALVIA';
  horaSalida: string; // HH:mm
  horaLlegada: string; // HH:mm
  duracionMinutos: number;
  precioTotal: number;
}

// Función auxiliar para sumar minutos a una hora HH:mm
function sumarMinutos(hora: string, minutos: number): string {
  const partes = hora.split(':');
  const h = parseInt(partes[0]);
  const m = parseInt(partes[1]);
  
  // Pasarlo todo a minutos y sumar
  const totalMinutos = (h * 60) + m + minutos;
  
  const nuevasHoras = Math.floor(totalMinutos / 60) % 24; // % 24 para que no pase de las 23:59
  const nuevosMinutos = totalMinutos % 60;
  
  let textoHoras = nuevasHoras.toString();
  let textoMinutos = nuevosMinutos.toString();
  
  if (nuevasHoras < 10) {
    textoHoras = "0" + textoHoras;
  }
  
  if (nuevosMinutos < 10) {
    textoMinutos = "0" + textoMinutos;
  }
  
  return textoHoras + ":" + textoMinutos;
}

export async function buscarViajes(origenId: number, destinoId: number, numPasajeros: number): Promise<Viaje[]> {
  // Simular la latencia de la red
  await new Promise(resolve => setTimeout(resolve, 1000));

  const resultados: Viaje[] = [];

  // Encontrar en qué itinerario están ambas estaciones
  const nodosOrigen = estacionesItinerarios.filter(e => e.idEstacion === origenId);
  const nodosDestino = estacionesItinerarios.filter(e => e.idEstacion === destinoId);

  let itinerarioValido: number | null = null;
  // Importamos el tipo EstacionItinerario arriba o lo inferimos, pero para que sea simple:
  let tramos: Array<any> = []; // Lo ponemos como Array<any> para simplificar, o mejor importamos el tipo.

  for (const nodoOrig of nodosOrigen) {
    const nodoDest = nodosDestino.find(n => n.idItinerario === nodoOrig.idItinerario);
    // Verificamos que el destino esté DESPUÉS del origen en este itinerario
    if (nodoDest && nodoOrig.orden < nodoDest.orden) {
      itinerarioValido = nodoOrig.idItinerario;
      
      // Obtenemos los tramos que hay entre origen y destino
      tramos = estacionesItinerarios.filter(
        e => e.idItinerario === itinerarioValido && 
             e.orden >= nodoOrig.orden && 
             e.orden < nodoDest.orden
      ).sort((a, b) => a.orden - b.orden);
      
      break;
    }
  }

  if (!itinerarioValido || tramos.length === 0) {
    return []; // Si no hay ruta posible, devolvemos array vacío
  }

  // Buscar los horarios de trenes para este itinerario
  const trenesDisponibles = frecuencias.filter(f => f.idItinerario === itinerarioValido);

  // Calcular el precio y hora de llegada para cada tren
  for (const tren of trenesDisponibles) {
    // Buscamos la configuración de ese tipo de tren (AVE o ALVIA)
    const config = configTrenes.find(c => c.tipo === tren.tipo);
    
    // Si por algún motivo no encontramos la configuración en la base de datos, lo ignoramos
    if (!config) {
      continue;
    }
    
    let duracionBase = 0;
    let precioBaseAcumulado = 0;
    let tarifaActual = config.tarifaInicial;

    // Recorremos los tramos uno por uno para aplicar descuentos por distancia
    for (const tramo of tramos) {
      const minTramo = tramo.minutosHastaSiguiente || 0;
      duracionBase += minTramo;

      // El Alvia es más lento, así que calculamos los minutos reales que tarda en este tramo
      const minTramoReal = minTramo * config.factorTiempo; 
      
      // Coste del tramo = minutos * tarifa (euros/min)
      precioBaseAcumulado += minTramoReal * tarifaActual;

      // Descuento progresivo: el siguiente tramo será más barato
      tarifaActual = Math.max(config.tarifaMinima, tarifaActual - config.decrementoPorTramo);
    }

    // Calcular totales finales
    const duracionReal = Math.round(duracionBase * config.factorTiempo);
    const precioPorPersona = config.precioBase + precioBaseAcumulado;
    const precioTotal = parseFloat((precioPorPersona * numPasajeros).toFixed(2));

    resultados.push({
      idViaje: `${tren.idFrecuencia}-${Date.now()}`,
      tipoTren: tren.tipo,
      horaSalida: tren.horaSalida,
      horaLlegada: sumarMinutos(tren.horaSalida, duracionReal),
      duracionMinutos: duracionReal,
      precioTotal: precioTotal
    });
  }

  // Devolvemos los resultados ordenados por hora de salida
  return resultados.sort((a, b) => a.horaSalida.localeCompare(b.horaSalida));
}
