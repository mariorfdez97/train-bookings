import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Viaje } from '../services/busqueda.service.ts';

// "forma" de la cesta de la compra
interface BookingState {
  viajeIda: Viaje | null;
  viajeVuelta: Viaje | null;
  pasajeros: number;
}

// Además de los datos, el contexto nos da funciones para modificarlos
interface BookingContextType extends BookingState {
  setViajeIda: (viaje: Viaje | null) => void;
  setViajeVuelta: (viaje: Viaje | null) => void;
  setPasajeros: (num: number) => void;
  clearBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const defaultState: BookingState = {
  viajeIda: null,
  viajeVuelta: null,
  pasajeros: 1,
};

// El Provider es el componente que envuelve a nuestra App y "reparte" los datos
export function BookingProvider({ children }: { children: ReactNode }) {
  // Intentamos recuperar la reserva a medias si el usuario recarga la página
  const [state, setState] = useState<BookingState>(() => {
    const saved = localStorage.getItem('trainBooking');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error leyendo localStorage de reserva", e);
      }
    }
    return defaultState;
  });

  // Cada vez que el estado cambia, lo guardamos en localStorage automáticamente
  useEffect(() => {
    localStorage.setItem('trainBooking', JSON.stringify(state));
  }, [state]);

  const setViajeIda = (viaje: Viaje | null) => {
    setState(prev => ({ ...prev, viajeIda: viaje }));
  };

  const setViajeVuelta = (viaje: Viaje | null) => {
    setState(prev => ({ ...prev, viajeVuelta: viaje }));
  };

  const setPasajeros = (num: number) => {
    setState(prev => ({ ...prev, pasajeros: num }));
  };

  const clearBooking = () => {
    setState(defaultState);
  };

  return (
    <BookingContext.Provider value={{ ...state, setViajeIda, setViajeVuelta, setPasajeros, clearBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

// Un "Hook" personalizado para que sea facilísimo acceder al carrito desde cualquier archivo
export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking debe usarse dentro de un BookingProvider');
  }
  return context;
}
