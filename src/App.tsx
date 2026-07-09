import { Routes, Route } from 'react-router-dom'
import SearchForm from './components/SearchForm/SearchForm'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Reserva de Trenes</h1>
        <p>Encuentra y reserva tu próximo viaje al mejor precio.</p>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<SearchForm />} />
          {/* Aquí añadiremos la pantalla de seleccionar asientos pronto */}
        </Routes>
        <Routes>
          <Route path="/" element={<SearchForm />} />
          {/*  Pantalla para seleccionar asientos pronto  */}
        </Routes>
      </main>
    </div>
  )
}

export default App
