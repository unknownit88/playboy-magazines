import type { Magazine } from '../types'

// Os filtros escolhidos pelo usuário. É SÓ isto que guardamos em estado.
export interface Filters {
  search: string
  condition: 'todas' | Magazine['condition']
  status: 'todas' | 'colecao' | 'procurando'
  sort: 'recentes' | 'ano-desc' | 'ano-asc' | 'titulo'
}

export const defaultFilters: Filters = { search: '', condition: 'todas', status: 'todas', sort: 'recentes' }

// Remove acentos e põe em minúsculas: "Edição" e "edicao" passam a ser iguais na busca.
function normalize(text: string): string {
  return text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
}

// FUNÇÃO PURA: mesma entrada → sempre a mesma saída, e não altera nada fora dela.
// Isso a torna fácil de testar (veremos nos testes) e de reaproveitar.
export function applyFilters(magazines: Magazine[], filters: Filters): Magazine[] {
  const term = normalize(filters.search.trim())

  const filtered = magazines.filter((m) => {
    if (filters.condition !== 'todas' && m.condition !== filters.condition) return false
    if (filters.status === 'colecao' && !m.acquired) return false
    if (filters.status === 'procurando' && m.acquired) return false
    if (term === '') return true
    return normalize(`${m.title} ${m.cover_model ?? ''}`).includes(term)
  })

  // .filter() já devolveu uma lista NOVA, então ordenar aqui não mexe na original.
  switch (filters.sort) {
    case 'ano-desc': return filtered.sort((a, b) => b.year - a.year || b.month - a.month)
    case 'ano-asc': return filtered.sort((a, b) => a.year - b.year || a.month - b.month)
    case 'titulo': return filtered.sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'))
    default: return filtered // 'recentes': mantém a ordem que veio do banco
  }
}
