import { useEffect, useState } from 'react'
import { MagazineCard } from '../components/MagazineCard'
import { CatalogFilters } from '../components/CatalogFilters'
import { listPublicMagazines } from '../lib/magazineService'
import { applyFilters, defaultFilters, type Filters } from '../lib/filters'
import type { Magazine } from '../types'

// Página aberta a qualquer visitante: não usa useSession, não pede login.
export function PublicCatalog() {
  const [magazines, setMagazines] = useState<Magazine[]>([])
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<Filters>(defaultFilters)
  const visibleMagazines = applyFilters(magazines, filters)

  useEffect(() => {
    listPublicMagazines()
      .then(setMagazines)
      .catch((e: Error) => setError(e.message))
  }, [])

  return (
    <div className="container">
      <header className="page-head">
        <p className="eyebrow">Acervo aberto</p>
        <h1>Catálogo público</h1>
      </header>

      <p className="subtitle">{visibleMagazines.length} de {magazines.length} revistas públicas</p>
      {error && <p className="form__error">Erro: {error}</p>}

      <CatalogFilters filters={filters} onChange={setFilters} showStatus={false} />

      {magazines.length === 0 && !error && <p className="subtitle">Nenhuma revista pública ainda.</p>}

      <div className="grid">
        {/* sem onDelete nem onTogglePublic: o card aparece só para leitura */}
        {visibleMagazines.map((m) => <MagazineCard key={m.id} magazine={m} />)}
      </div>
    </div>
  )
}
