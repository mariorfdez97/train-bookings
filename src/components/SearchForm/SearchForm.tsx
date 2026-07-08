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
    if (!formData.origen || !formData.destino || !formData.fechaIda) return;

    setIsSearching(true);
    
    const viajes = await buscarViajes(
      formData.origen.idEstacion, 
      formData.destino.idEstacion, 
      formData.pasajeros
    );
    
    setResultados(viajes);
    setIsSearching(false);
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
            getOptionLabel={(option) => option.nombre}
            value={formData.origen}
            onChange={(_, newValue) => setFormData({ ...formData, origen: newValue })}
            renderInput={(params) => <TextField {...params} label="Estación de origen" />}
            isOptionEqualToValue={(option, value) => option.idEstacion === value.idEstacion}
          />

          {/* Destino */}
          <Autocomplete
            options={estaciones}
            getOptionLabel={(option) => option.nombre}
            value={formData.destino}
            onChange={(_, newValue) => setFormData({ ...formData, destino: newValue })}
            renderInput={(params) => <TextField {...params} label="Estación de destino" />}
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

      {/* RESULTADOS DE LA BÚSQUEDA */}
      {resultados.length > 0 && (
        <div className="resultados-container">
          <h3>Billetes Disponibles</h3>
          {resultados.map((viaje) => (
            <Paper key={viaje.idViaje} className="billete-card" elevation={2}>
              
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
          ))}
        </div>
      )}

    </LocalizationProvider>
  )
}
