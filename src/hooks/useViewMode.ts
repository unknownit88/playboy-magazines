import { useState } from 'react'

// vertical = grade que rola para baixo; horizontal = fileira que rola para os lados;
// mosaico = capas pequenas e coladas, com o texto sobre a imagem.
export type ViewMode = 'vertical' | 'horizontal' | 'mosaico'
const MODES: ViewMode[] = ['vertical', 'horizontal', 'mosaico']
const STORAGE_KEY = 'modo-visualizacao'

function readMode(): ViewMode {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    // Só aceita um valor conhecido: se alguém mexer no armazenamento, voltamos ao padrão.
    return MODES.find((mode) => mode === saved) ?? 'vertical'
  } catch {
    return 'vertical'
  }
}

export function useViewMode(): [ViewMode, (mode: ViewMode) => void] {
  const [mode, setMode] = useState<ViewMode>(readMode)

  // Aqui gravamos no próprio evento de troca (sem useEffect): é o jeito mais simples quando
  // a mudança nasce de um clique do usuário.
  function change(next: ViewMode) {
    setMode(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* sem armazenamento: a escolha só não é lembrada */
    }
  }

  return [mode, change]
}
