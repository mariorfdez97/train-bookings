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
import type { Estacion } from '../../types/index.ts'
import './SearchForm.css'

// Definimos la forma de los datos que vamos a guardar en el formulario
interface FormState {
  origen: Estacion | null
  destino: Estacion | null
  fechaIda: string | null     // guardamos como string (ISO) para localStorage
  soloIda: boolean
  fechaVuelta: string | null
  pasajeros: number
}

// Valores por defecto al empezar
const defaultState: FormState = {
  origen: null,
  destino: null,
  fechaIda: null,
  soloIda: false,
  fechaVuelta: null,
  pasajeros: 1
}

export default function SearchForm() {
  // 1. ESTADO DEL COMPONENTE
  // isLoading nos dice si estamos esperando a que carguen las estaciones
  const [isLoading, setIsLoading] = useState(true)
  const [estaciones, setEstaciones] = useState<Estacion[]>([])

  // Estado del formulario: primero intentamos leer de localStorage
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

  // 2. EFECTOS (useEffect)
  // Este useEffect se ejecuta SOLO UNA VEZ al montar el componente (por el array vacío [])
  useEffect(() => {
    // Definimos una función asíncrona dentro porque useEffect no puede ser async directamente
    async function loadData() {
      setIsLoading(true)
      const data = await getEstaciones()
      setEstaciones(data)
      setIsLoading(false)
    }
    
    loadData()
  }, [])

  // Este useEffect se ejecuta CADA VEZ que formData cambia
  useEffect(() => {
    localStorage.setItem('trainSearchForm', JSON.stringify(formData))
  }, [formData])

  // 3. FUNCIONES MANEJADORAS
  const handleBuscar = () => {
    console.log("Buscando viajes con:", formData)
    // Aquí luego añadiremos la lógica de búsqueda
  }

  // Si estamos cargando, mostramos la animación CSS y no el formulario
  if (isLoading) {
    return (
      <div className="loader-container">
        <div className="train-loader">🚂</div>
        <p>Cargando estaciones...</p>
      </div>
    )
  }

  // 4. RENDERIZADO DEL FORMULARIO
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
            disabled={!formData.origen || !formData.destino || !formData.fechaIda}
          >
            Buscar
          </Button>
        </Box>
      </Paper>
    </LocalizationProvider>
  )
}
