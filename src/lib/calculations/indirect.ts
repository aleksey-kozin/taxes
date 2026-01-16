import type { UserProfile, IndirectTaxRules } from '@/types'

/**
 * Расчёт НДС (оценочно)
 * НДС как доля от трат
 */
export function calcVatEstimate(
  monthlySpending: number,
  vatRate: number
): number {
  const annualSpending = monthlySpending * 12
  // Конвертируем в копейки для точности
  const annualSpendingKopecks = Math.round(annualSpending * 100)
  const vatKopecks = Math.round(annualSpendingKopecks * vatRate)
  return Math.round(vatKopecks) / 100 // округляем и конвертируем в рубли
}

/**
 * Расчёт акцизов
 * По категориям: топливо, алкоголь, табак
 */
export function calcExciseTaxes(
  profile: UserProfile,
  rules: IndirectTaxRules
): number {
  if (!profile.optionalExpenses) {
    return 0
  }

  const { fuel = 0, alcohol = 0, tobacco = 0 } = profile.optionalExpenses
  const { exciseRates } = rules

  // Конвертируем в копейки для точности
  const fuelMonthlyKopecks = Math.round(fuel * 100)
  const alcoholMonthlyKopecks = Math.round(alcohol * 100)
  const tobaccoMonthlyKopecks = Math.round(tobacco * 100)

  // Акцизы в месяц
  const fuelExciseKopecks = Math.round(fuelMonthlyKopecks * exciseRates.fuel)
  const alcoholExciseKopecks = Math.round(alcoholMonthlyKopecks * exciseRates.alcohol)
  const tobaccoExciseKopecks = Math.round(tobaccoMonthlyKopecks * exciseRates.tobacco)

  // Акцизы в год
  const totalExciseKopecks = (fuelExciseKopecks + alcoholExciseKopecks + tobaccoExciseKopecks) * 12

  return Math.round(totalExciseKopecks) / 100 // округляем и конвертируем в рубли
}
