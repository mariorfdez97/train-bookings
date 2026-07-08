# Train Bookings 🚂

App web para reservar billetes de tren. Hecha con React, TypeScript y Vite.

## Tecnologías

- **React 19** con TypeScript
- **Vite** como bundler y servidor de desarrollo
- **Material UI** para los componentes de UI
- **React Router** para la navegación entre páginas

## Cómo arrancar

```bash
npm install
npm run dev
```

## Estructura del proyecto

```
src/
├── components/   # Componentes reutilizables
├── data/         # Datos estáticos (estaciones, itinerarios, etc.)
├── services/     # Funciones que simulan llamadas al backend
├── pages/        # Páginas de la app (rutas)
├── types/        # Interfaces y tipos de TypeScript
├── utils/        # Funciones auxiliares
└── context/      # React Context para estado compartido
```

## Flujo de la app

1. Página principal → buscar trenes por origen, destino y fecha
2. Listado de viajes disponibles → elegir tren
3. Selección de asientos
4. Datos de los pasajeros
5. Confirmación de reserva
