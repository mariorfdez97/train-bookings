import SearchForm from './components/SearchForm/SearchForm'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>🚂 Reserva de Trenes</h1>
        <p>Encuentra y reserva tu próximo viaje al mejor precio.</p>
      </header>
      
      <main className="app-main">
        <SearchForm />
      </main>
    </div>
  )
}

export default App
