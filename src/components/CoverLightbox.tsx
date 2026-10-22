import { useEffect } from 'react'
import type { Magazine } from '../types'

interface CoverLightboxProps {
  magazine: Magazine
  onClose: () => void
}

// Mostra a capa INTEIRA, grande, sobre um fundo escuro (o "zoom" do mosaico).
export function CoverLightbox({ magazine, onClose }: CoverLightboxProps) {
  // Fecha com Esc, como o Modal. O return do useEffect desliga o ouvinte.
  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  if (!magazine.cover_image_url) return null

  return (
    // Clicar no fundo fecha; clicar na imagem não (ela está dentro e não "vaza" o clique).
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={`Capa de ${magazine.title}`} onClick={onClose}>
      {/* autoFocus: o foco do teclado vai para o botão de fechar ao abrir */}
      <button type="button" className="lightbox__close" aria-label="Fechar" autoFocus onClick={onClose}>
        ✕
      </button>
      <img
        className="lightbox__img"
        src={magazine.cover_image_url}
        alt={`Capa de ${magazine.title}`}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  )
}
