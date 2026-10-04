// Descreve o "formato" de uma revista.
// O TypeScript usa isso para avisar se esquecermos um campo ou errarmos um nome.
export interface Magazine {
  id: string
  title: string
  year: number
  month: number // 1 a 12
  cover_model?: string | null // o "?" significa que o campo é opcional
  condition: 'Excelente' | 'Bom' | 'Regular' | 'Ruim' // só estes 4 valores são aceitos
  acquired: boolean
  is_public: boolean // true = aparece no catálogo público
  cover_image_url?: string | null // endereço da imagem da capa (o banco devolve null se não houver)
}
