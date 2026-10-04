import { useEffect, useState } from 'react'
import type { Magazine } from '../types'
import type { NewMagazine } from '../lib/magazineService'

const MAX_COVER_MB = 5

interface MagazineFormProps {
  // O formulário não sabe SALVAR. Ele só avisa o pai: "o usuário quer adicionar isto".
  // Devolve uma Promise<boolean>: true = salvou (podemos limpar os campos), false = falhou.
  onSubmit: (magazine: NewMagazine, cover: File | null) => Promise<boolean>
  // Se vier uma revista, o formulário está em modo EDIÇÃO (campos já preenchidos).
  initial?: Magazine
  onCancel?: () => void
}

const conditions: Magazine['condition'][] = ['Excelente', 'Bom', 'Regular', 'Ruim']

export function MagazineForm({ onSubmit, initial, onCancel }: MagazineFormProps) {
  // Cada campo do formulário é um estado: quando muda, a tela é redesenhada.
  const [title, setTitle] = useState(initial?.title ?? '')
  const [year, setYear] = useState(initial?.year?.toString() ?? '')
  const [month, setMonth] = useState(initial?.month?.toString() ?? '')
  const [coverModel, setCoverModel] = useState(initial?.cover_model ?? '')
  const [condition, setCondition] = useState<Magazine['condition']>(initial?.condition ?? 'Bom')
  const [acquired, setAcquired] = useState(initial?.acquired ?? true)
  const [isPublic, setIsPublic] = useState(initial?.is_public ?? true) // revista nova já entra no catálogo público
  const [cover, setCover] = useState<File | null>(null)
  const [coverError, setCoverError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [fileInputKey, setFileInputKey] = useState(0) // trocar a key "zera" o campo de arquivo
  const [saving, setSaving] = useState(false)

  // Cria um endereço temporário para mostrar a imagem escolhida ANTES de enviar.
  useEffect(() => {
    if (!cover) { setPreview(null); return }
    const url = URL.createObjectURL(cover)
    setPreview(url)
    return () => URL.revokeObjectURL(url) // libera a memória quando trocar ou sair
  }, [cover])

  function handleCoverChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null
    setCoverError(null)

    // Validação no navegador: dá resposta rápida, mas NÃO é segurança (o usuário pode burlar).
    if (file && !file.type.startsWith('image/')) {
      setCoverError('O arquivo precisa ser uma imagem.')
      setCover(null)
      return
    }
    if (file && file.size > MAX_COVER_MB * 1024 * 1024) {
      setCoverError(`A imagem passa de ${MAX_COVER_MB} MB.`)
      setCover(null)
      return
    }
    setCover(file)
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault() // impede o navegador de recarregar a página

    if (title.trim() === '') return // não aceita título vazio

    setSaving(true)
    const saved = await onSubmit(
      {
        title: title.trim(),
        // Campo vazio vira null ("não sei"); caso contrário, o número digitado.
        year: year === '' ? null : Number(year),
        month: month === '' ? null : Number(month),
        // null (e não undefined) para o banco LIMPAR o campo ao editar:
        // undefined some do envio, e o valor antigo ficaria no banco.
        cover_model: coverModel.trim() || null,
        condition,
        acquired,
        is_public: isPublic,
      },
      cover,
    )
    setSaving(false)

    if (saved && !initial) {
      // limpa os campos para o próximo cadastro (se falhou, mantém: nada se perde)
      setTitle('')
      setCoverModel('')
      setCover(null)
      setFileInputKey(fileInputKey + 1)
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>{initial ? 'Editar revista' : 'Nova revista'}</h2>

      <label>
        Título
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>

      <div className="form__row">
        <label>
          Mês (opcional)
          <input type="number" min={1} max={12} value={month} onChange={(e) => setMonth(e.target.value)} />
        </label>
        <label>
          Ano (opcional)
          <input type="number" min={1953} max={2100} value={year} onChange={(e) => setYear(e.target.value)} />
        </label>
      </div>

      <label>
        Modelo da capa (opcional)
        <input value={coverModel} onChange={(e) => setCoverModel(e.target.value)} />
      </label>

      <label>
        Capa (imagem, até {MAX_COVER_MB} MB)
        <input key={fileInputKey} type="file" accept="image/*" onChange={handleCoverChange} />
      </label>
      {coverError && <p className="form__error">{coverError}</p>}
      {(preview ?? initial?.cover_image_url) && (
        <img className="form__preview" src={preview ?? initial?.cover_image_url ?? undefined} alt="Prévia da capa" />
      )}

      <label>
        Condição
        <select value={condition} onChange={(e) => setCondition(e.target.value as Magazine['condition'])}>
          {conditions.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </label>

      <label className="form__check">
        <input type="checkbox" checked={acquired} onChange={(e) => setAcquired(e.target.checked)} />
        Já tenho esta revista
      </label>

      <label className="form__check">
        <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
        Mostrar no catálogo público (visível para qualquer pessoa)
      </label>

      <button type="submit" disabled={saving}>{saving ? 'Salvando...' : initial ? 'Salvar' : 'Adicionar'}</button>
      {onCancel && <button type="button" onClick={onCancel}>Cancelar</button>}
    </form>
  )
}
