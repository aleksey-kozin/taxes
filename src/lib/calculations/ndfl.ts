import type { NdflBracket, NdflBreakdown } from '@/types'

/**
 * Расчёт НДФЛ по прогрессивной шкале (маржинально)
 * Все расчёты в копейках (integer), возврат в рублях
 */
export function calcNdflProgressive(
  income: number, // доход в рублях
  brackets: NdflBracket[]
): { total: number; breakdown: NdflBreakdown[] } {
  // Конвертируем в копейки для точности
  let incomeKopecks = Math.round(income * 100)
  let totalTaxKopecks = 0
  const breakdown: NdflBreakdown[] = []

  // Сортируем брекеты по порогу (от меньшего к большему)
  const sortedBrackets = [...brackets].sort((a, b) => a.threshold - b.threshold)

  for (let i = 0; i < sortedBrackets.length; i++) {
    const bracket = sortedBrackets[i]
    const nextBracket = sortedBrackets[i + 1]

    // Определяем верхнюю границу текущего брекета
    const upperBound = nextBracket ? nextBracket.threshold : Infinity

    // Доход, попадающий в этот брекет
    const bracketStartKopecks = Math.round(bracket.threshold * 100)
    const bracketEndKopecks = Math.round(upperBound * 100)

    if (incomeKopecks <= bracketStartKopecks) {
      // Доход не достиг этого брекета
      break
    }

    // Часть дохода в этом брекете
    const incomeInBracketKopecks = Math.min(
      incomeKopecks - bracketStartKopecks,
      bracketEndKopecks - bracketStartKopecks
    )

    if (incomeInBracketKopecks > 0) {
      // Налог в этом брекете
      const taxInBracketKopecks = Math.round(incomeInBracketKopecks * bracket.rate)
      totalTaxKopecks += taxInBracketKopecks

      breakdown.push({
        bracket: i + 1,
        income: incomeInBracketKopecks / 100, // обратно в рубли
        rate: bracket.rate,
        tax: taxInBracketKopecks / 100, // обратно в рубли
      })
    }
  }

  return {
    total: Math.round(totalTaxKopecks) / 100, // округляем и конвертируем в рубли
    breakdown,
  }
}
