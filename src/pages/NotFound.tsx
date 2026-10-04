import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="container">
      <header className="page-head">
        <p className="eyebrow">Erro 404</p>
        <h1>Página não encontrada</h1>
      </header>
      <Link to="/" className="btn">Voltar ao início</Link>
    </div>
  )
}
