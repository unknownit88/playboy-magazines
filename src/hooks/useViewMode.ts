import { useState } from 'react'

// vertical = grade que rola para baixo; horizontal = fileira que rola para os lados.
export type ViewMode = 'vertical' | 'horizontal'
const STORAGE_KEY = 'modo-visualizacao'

function readMode(): ViewMode {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'horizontal' ? 'horizontal' : 'vertical'
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
