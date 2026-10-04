import { describe, expect, it } from 'vitest'
import { parseCoverFilename } from './parseCoverFilename'

describe('parseCoverFilename', () => {
  describe('padrão completo: aa__mm__Playboy-No-edição-nome', () => {
    it('extrai edição, ano, mês e título', () => {
      expect(parseCoverFilename('99__12__Playboy-No-293-Joana-Prado-Feiticeira.jpg')).toEqual({
        title: 'Joana Prado Feiticeira',
        issue: '293',
        year: 1999,
        month: 12,
      })
    })

    it('aceita sublinhado simples e sublinhado dentro do nome', () => {
      expect(parseCoverFilename('89_03__Playboy-No-164-Silvia_Rossi.jpg')).toMatchObject({
        title: 'Silvia Rossi',
        issue: '164',
        year: 1989,
        month: 3,
      })
    })

    it('ignora maiúsculas no "Playboy-No" e a extensão', () => {
      expect(parseCoverFilename('10__09__PLAYBOY-NO-424-Larissa-Riquelme.JPEG')).toMatchObject({
        title: 'Larissa Riquelme',
        issue: '424',
        year: 2010,
        month: 9,
      })
    })
  })

  describe('século do ano de dois dígitos (a revista começou em 1975)', () => {
    it('75 ou mais vira 19xx', () => {
      expect(parseCoverFilename('75__08__Playboy-No-1-Primeira.jpg').year).toBe(1975)
      expect(parseCoverFilename('99__01__Playboy-No-1-X.jpg').year).toBe(1999)
    })

    it('abaixo de 75 vira 20xx', () => {
      expect(parseCoverFilename('00__01__Playboy-No-1-X.jpg').year).toBe(2000)
      expect(parseCoverFilename('05__06__Playboy-No-358-Flavia-Monteiro.jpg').year).toBe(2005)
    })
  })

  describe('dados incompletos', () => {
    it('mês inválido vira null, mas o ano e a edição são mantidos', () => {
      expect(parseCoverFilename('99__13__Playboy-No-293-Alguem.jpg')).toMatchObject({
        year: 1999,
        month: null,
        issue: '293',
      })
    })

    it('sem prefixo de data: acha a edição e deixa ano e mês em null', () => {
      expect(parseCoverFilename('Playboy-No-293-Joana-Prado.jpg')).toEqual({
        title: 'Joana Prado',
        issue: '293',
        year: null,
        month: null,
      })
    })

    it('nome fora do padrão: usa o nome limpo como título', () => {
      expect(parseCoverFilename('capa_especial-de-natal.png')).toEqual({
        title: 'capa especial de natal',
        issue: null,
        year: null,
        month: null,
      })
    })

    it('arquivo sem nome útil vira "Sem título"', () => {
      expect(parseCoverFilename('.jpg').title).toBe('Sem título')
    })
  })

  describe('limpeza do título', () => {
    it('junta espaços repetidos e tira as pontas', () => {
      expect(parseCoverFilename('capa  -- dupla __ nome.jpg').title).toBe('capa dupla nome')
    })

    it('só tira a ÚLTIMA extensão (nomes com ponto continuam inteiros)', () => {
      expect(parseCoverFilename('Dra.-Silva.jpg').title).toBe('Dra. Silva')
    })
  })
})
