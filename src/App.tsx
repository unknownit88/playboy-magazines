import { BrowserRouter, Link, NavLink, Route, Routes } from 'react-router-dom'
import { Catalog } from './pages/Catalog'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { PublicCatalog } from './pages/PublicCatalog'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <header className="site-header">
        <Link to="/" className="brand">PLAYBOY BRASIL</Link>
        <nav className="nav" aria-label="Principal">
          {/* "end": sem isto, o link "/" ficaria ativo em TODAS as páginas */}
          <NavLink to="/" end>HOME</NavLink>
          <NavLink to="/catalog">Minha coleção</NavLink>
          <NavLink to="/public">Catálogo Público</NavLink>
        </nav>
      </header>

      <main>
        {/* Só UMA destas é desenhada, conforme o endereço do navegador */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/public" element={<PublicCatalog />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
