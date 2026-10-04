import type { Magazine } from '../types'

// "Props" são os dados que o componente recebe de fora.
// Aqui, cada card recebe UMA revista e só se preocupa em mostrá-la.
interface MagazineCardProps {
  magazine: Magazine
  // Opcionais: no catálogo público o visitante só LÊ, então não passamos as ações.
  onDelete?: (id: string) => void
  onEdit?: (magazine: Magazine) => void
  onTogglePublic?: (magazine: Magazine) => void
}

export function MagazineCard({ magazine, onDelete, onEdit, onTogglePublic }: MagazineCardProps) {
  return (
    <article className={magazine.acquired ? 'card' : 'card card--missing'}>
      {magazine.cover_image_url && (
        // loading="lazy": o navegador só baixa a imagem quando ela está perto de aparecer
        <img className="card__cover" src={magazine.cover_image_url} alt={`Capa de ${magazine.title}`} loading="lazy" />
      )}
      <h2>{magazine.title}</h2>
      <p className="card__date">
        {String(magazine.month).padStart(2, '0')}/{magazine.year}
      </p>
      {magazine.cover_model && <p>Capa: {magazine.cover_model}</p>}
      <p>Condição: {magazine.condition}</p>
      <span className="card__badge">{magazine.acquired ? 'Na coleção' : 'Procurando'}</span>
      {magazine.is_public && <span className="card__badge">Pública</span>}
      {onTogglePublic && (
        <button className="card__action" onClick={() => onTogglePublic(magazine)}>
          {magazine.is_public ? 'Tornar privada' : 'Tornar pública'}
        </button>
      )}
      {onEdit && (
        <button className="card__action" onClick={() => onEdit(magazine)}>Editar</button>
      )}
      {onDelete && (
        <button className="card__action" onClick={() => onDelete(magazine.id)}>Deletar</button>
      )}
    </article>
  )
}
