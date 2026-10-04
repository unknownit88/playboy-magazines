export interface ParsedCover {
  title: string
  issue: string | null
  year: number | null
  month: number | null
}

// Aceita, nesta ordem de preferência:
//   99__12__Playboy-No-293-Joana-Prado.jpg   (data + edição + nome)
//   Playboy-No-293-Joana-Prado.jpg           (edição + nome, sem data)
// O prefixo de data é opcional (o "?" depois do grupo). Aceita um ou dois sublinhados entre as partes.
// "i" no fim = ignora maiúsculas e minúsculas.
const PATTERN = /^(?:(\d{2})_{1,2}(\d{2})_{1,2})?playboy-no-(\d+)-(.+)$/i

// A Playboy brasileira começou em 1975: "75" a "99" são anos 1900, "00" a "74" são anos 2000.
function fullYear(twoDigits: number): number {
  return twoDigits >= 75 ? 1900 + twoDigits : 2000 + twoDigits
}

// "joana-prado__x" -> "joana prado x": troca - e _ por espaço e junta espaços repetidos.
function cleanName(text: string): string {
  return text.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim()
}

// FUNÇÃO PURA: só recebe um texto e devolve dados. Não toca em arquivo, tela nem banco.
export function parseCoverFilename(filename: string): ParsedCover {
  // Tira só a ÚLTIMA extensão: "Dra.-Silva.jpg" -> "Dra.-Silva"
  const base = filename.replace(/\.[^.]+$/, '')
  const match = PATTERN.exec(base)

  if (!match) {
    return { title: cleanName(base) || 'Sem título', issue: null, year: null, month: null }
  }

  const [, yy, mm, issue, name] = match
  const month = mm === undefined ? null : Number(mm)

  return {
    title: cleanName(name) || 'Sem título',
    issue,
    year: yy === undefined ? null : fullYear(Number(yy)),
    month: month !== null && month >= 1 && month <= 12 ? month : null, // mês fora de 1 a 12 vira "não sei"
  }
}
