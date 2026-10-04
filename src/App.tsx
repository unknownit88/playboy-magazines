import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'
import { Catalog } from './pages/Catalog'
import { PublicCatalog } from './pages/PublicCatalog'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <main className="container">
        <h1>PLAYBOY MAGAZINE</h1>

        <nav className="nav">
          <NavLink to="/">Minha coleção</NavLink>
          <NavLink to="/public">Catálogo público</NavLink>
        </nav>

        {/* Só UMA destas é desenhada, conforme o endereço do navegador */}
        <Routes>
          <Route path="/" element={<Catalog />} />
          <Route path="/public" element={<PublicCatalog />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
