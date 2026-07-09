import { useState, useEffect } from 'react'
import {
  Autocomplete,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Box,
  Paper
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'

import { useBooking } from '../../context/BookingContext.tsx'
import { getEstaciones } from '../../services/estaciones.service.ts'
import { buscarViajes } from '../../services/busqueda.service.ts'
import type { Estacion } from '../../types/index.ts'
import type { Viaje } from '../../services/busqueda.service.ts'
import './SearchForm.css'

interface FormState {
  origen: Estacion | null
  destino: Estacion | null
  fechaIda: string | null     // guardamos como string (ISO) para localStorage
  soloIda: boolean
  fechaVuelta: string | null
  pasajeros: number
}

const defaultState: FormState = {
  origen: null,
  destino: null,
  fechaIda: null,
  soloIda: false,
  fechaVuelta: null,
  pasajeros: 1
}

export default function SearchForm() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const [estaciones, setEstaciones] = useState<Estacion[]>([])
  const [resultados, setResultados] = useState<Viaje[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  // Traemos nuestro "carrito global"
  const { viajeIda, setViajeIda, pasajeros, setPasajeros } = useBooking()

  const [formData, setFormData] = useState<FormState>(() => {
    const saved = localStorage.getItem('trainSearchForm')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error("Error leyendo localStorage", e)
      }
    }
    return defaultState
  })

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      const data = await getEstaciones()
      setEstaciones(data)
      setIsLoading(false)
    }

    loadData()
  }, [])

  useEffect(() => {
    localStorage.setItem('trainSearchForm', JSON.stringify(formData))
  }, [formData])

  const handleBuscar = async () => {
    if (!formData.origen || !formData.destino || !formData.fechaIda) return; //por si acaso funciona mal

    setIsSearching(true); // para que no pueda repetir búsqueda
    setHasSearched(false);

    const viajes = await buscarViajes(
      formData.origen.idEstacion,
      formData.destino.idEstacion,
      formData.pasajeros
    );

    // Guardamos en el carrito para cuánta gente estamos buscando
    setPasajeros(formData.pasajeros);

    setResultados(viajes);
    setIsSearching(false);
    setHasSearched(true);
  }

  if (isLoading) {
    return (
      <div className="loader-container">
        <div className="train-loader">🚂</div>
        <p>Cargando estaciones...</p>
      </div>
    )
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper elevation={3} className="search-form-container">
        <h2>Encuentra tu viaje</h2>

        <Box className="form-grid">
          {/* Origen */}
          <Autocomplete
            options={estaciones}
            // getOptionLabel le dice a MUI qué campo del objeto mostrar en la pantalla (el texto de la lista)
            getOptionLabel={(option) => option.nombre}
            value={formData.origen}
            // onChange se dispara al elegir una opción. 
            // El '_' significa que ignoramos el evento de clic nativo, solo nos interesa el 'newValue' (la ciudad elegida)
            // { ...formData } hace una fotocopia del formulario entero antes de cambiar el origen (evita mutar el estado directamente)
            onChange={(_, newValue) => setFormData({ ...formData, origen: newValue })} 
            renderInput={(params) => <TextField {...params} label="Estación de origen" />}
            isOptionEqualToValue={(option, value) => option.idEstacion === value.idEstacion}
          />

          {/* Destino */}
          <Autocomplete
            options={estaciones}
            getOptionLabel={(option) => option.nombre}
            value={formData.destino}
            // Hacemos la misma fotocopia con el spread operator (...formData) pero esta vez actualizando el destino
            onChange={(_, newValue) => setFormData({ ...formData, destino: newValue })}
            renderInput={(params) => <TextField {...params} label="Estación de destino" />}
            // isOptionEqualToValue le sirve a MUI para saber internamente si dos opciones son exactamente la misma
            isOptionEqualToValue={(option, value) => option.idEstacion === value.idEstacion}
          />

          {/* Fecha de Ida */}
          <DatePicker
            label="Fecha de ida"
            disablePast // No deja seleccionar fechas pasadas
            value={formData.fechaIda ? dayjs(formData.fechaIda) : null}
            onChange={(newDate) => setFormData({ ...formData, fechaIda: newDate ? newDate.toISOString() : null })}
          />

          {/* Checkbox Solo Ida */}
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.soloIda}
                onChange={(e) => setFormData({ ...formData, soloIda: e.target.checked })}
              />
            }
            label="Solo ida"
          />

          {/* Fecha de Vuelta (Condicional) */}
          {!formData.soloIda && (
            <DatePicker
              label="Fecha de regreso"
              disabled={!formData.fechaIda} // Deshabilitado si no hay ida
              minDate={formData.fechaIda ? dayjs(formData.fechaIda) : undefined} // No anterior a la ida
              value={formData.fechaVuelta ? dayjs(formData.fechaVuelta) : null}
              onChange={(newDate) => setFormData({ ...formData, fechaVuelta: newDate ? newDate.toISOString() : null })}
            />
          )}

          {/* Pasajeros */}
          <TextField
            label="Pasajeros"
            type="number"
            slotProps={{ htmlInput: { min: 1 } }} // Solo enteros > 0
            value={formData.pasajeros}
            onChange={(e) => setFormData({ ...formData, pasajeros: parseInt(e.target.value) || 1 })}
          />

          <Button
            variant="contained"
            size="large"
            color="primary"
            onClick={handleBuscar}
            className="search-button"
            disabled={!formData.origen || !formData.destino || !formData.fechaIda || isSearching}
          >
            {isSearching ? 'Buscando trenes...' : 'Buscar'}
          </Button>
        </Box>
      </Paper>

      {/* RESULTADOS DE LA BÚSQUEDA Y CARRITO */}
      <Box className="layout-resultados-carrito">
        {/* Lado izquierdo: Lista de trenes */}
        <div className="resultados-container">
          {resultados.length > 0 && <h3>Billetes Disponibles</h3>}

          {resultados.map((viaje) => {
            const isSelected = viajeIda?.idViaje === viaje.idViaje;

            return (
              <Paper
                key={viaje.idViaje}
                className={`billete-card ${isSelected ? 'selected' : ''}`}
                elevation={isSelected ? 6 : 2}
                onClick={() => setViajeIda(viaje)}
              >
                <div className="billete-header">
                  <span className="tren-tipo">{viaje.tipoTren}</span>
                  <span className="tren-precio">{viaje.precioTotal} €</span>
                </div>

                <div className="billete-horarios">
                  <div>
                    <strong>Salida:</strong> {viaje.horaSalida}
                  </div>
                  <div className="duracion">
                    ⏱️ {viaje.duracionMinutos} min
                  </div>
                  <div>
                    <strong>Llegada:</strong> {viaje.horaLlegada}
                  </div>
                </div>
              </Paper>
            )
          })}

          {hasSearched && resultados.length === 0 && (
            <Paper elevation={2} className="no-resultados-card">
              <p className="no-resultados-title">⚠️ No se encontraron viajes disponibles</p>
              <p className="no-resultados-text">
                Por favor, verifica el trayecto seleccionado. Ten en cuenta que la base de datos actual solo admite rutas en la dirección predefinida (por ejemplo: de <strong>Madrid</strong> hacia <strong>Sevilla</strong>, <strong>Gijón</strong> o <strong>Elche</strong>, pero no en sentido contrario).
              </p>
            </Paper>
          )}
        </div>

        {/* Lado derecho: Carrito de compra flotante */}
        {resultados.length > 0 && (
          <div className="carrito-container">
            <Paper elevation={3} className="carrito-card">
              <h3>Resumen de Reserva</h3>
              {viajeIda ? (
                <>
                  <p><strong>Tren:</strong> {viajeIda.tipoTren}</p>
                  <p><strong>Trayecto:</strong> {formData.origen?.nombre} ➔ {formData.destino?.nombre}</p>
                  <p><strong>Salida:</strong> {viajeIda.horaSalida}</p>
                  <p><strong>Pasajeros:</strong> {pasajeros}</p>
                  <hr className="carrito-divider" />
                  <h2 className="carrito-total">Total: {viajeIda.precioTotal} €</h2>
                  <Button variant="contained" color="success" size="large" fullWidth>
                    Seleccionar Asientos
                  </Button>
                </>
              ) : (
                <p className="carrito-vacio">Selecciona un viaje de la lista para continuar.</p>
              )}
            </Paper>
          </div>
        )}
      </Box>

    </LocalizationProvider>
  )
}
