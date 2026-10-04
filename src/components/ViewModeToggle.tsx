import type { ViewMode } from '../hooks/useViewMode'

interface ViewModeToggleProps {
  mode: ViewMode
  onChange: (mode: ViewMode) => void
}

// Controle segmentado: dois botões, só um fica ativo. aria-pressed avisa leitores de tela qual é.
export function ViewModeToggle({ mode, onChange }: ViewModeToggleProps) {
  return (
    <div className="segmented" role="group" aria-label="Modo de visualização">
      <button type="button" aria-pressed={mode === 'vertical'} onClick={() => onChange('vertical')}>
        <span aria-hidden="true">↕</span> Vertical
      </button>
      <button type="button" aria-pressed={mode === 'horizontal'} onClick={() => onChange('horizontal')}>
        <span aria-hidden="true">↔</span> Horizontal
      </button>
    </div>
  )
}
