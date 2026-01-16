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

  const expenses = profile.optionalExpenses
  const { exciseRates } = rules

  // Топливо: используем детализацию или устаревшее поле
  let fuelMonthly = 0
  if (expenses.hasCar) {
    fuelMonthly = (expenses.gasSpendMonthly || 0) + (expenses.dieselSpendMonthly || 0)
  } else if (expenses.fuel) {
    // Обратная совместимость
    fuelMonthly = expenses.fuel
  }

  // Алкоголь: используем детализацию или устаревшее поле
  // Примерные цены: пиво 0.5л - 100₽, вино 0.7л - 500₽, водка 0.5л - 400₽
  let alcoholMonthly = 0
  if (expenses.hasAlcohol) {
    const beerPrice = 100 // примерная цена пива 0.5л
    const winePrice = 500 // примерная цена вина 0.7л
    const vodkaPrice = 400 // примерная цена водки 0.5л
    alcoholMonthly = 
      (expenses.beer05PerMonth || 0) * beerPrice +
      (expenses.wine07PerMonth || 0) * winePrice +
      (expenses.vodka05PerMonth || 0) * vodkaPrice
  } else if (expenses.alcohol) {
    // Обратная совместимость
    alcoholMonthly = expenses.alcohol
  }

  // Сигареты: используем детализацию или устаревшее поле
  let tobaccoMonthly = 0
  if (expenses.hasCigarettes) {
    tobaccoMonthly = (expenses.cigPacksPerMonth || 0) * (expenses.cigPackPrice || 0)
  } else if (expenses.tobacco) {
    // Обратная совместимость
    tobaccoMonthly = expenses.tobacco
  }

  // Конвертируем в копейки для точности
  const fuelMonthlyKopecks = Math.round(fuelMonthly * 100)
  const alcoholMonthlyKopecks = Math.round(alcoholMonthly * 100)
  const tobaccoMonthlyKopecks = Math.round(tobaccoMonthly * 100)

  // Акцизы в месяц
  const fuelExciseKopecks = Math.round(fuelMonthlyKopecks * exciseRates.fuel)
  const alcoholExciseKopecks = Math.round(alcoholMonthlyKopecks * exciseRates.alcohol)
  const tobaccoExciseKopecks = Math.round(tobaccoMonthlyKopecks * exciseRates.tobacco)

  // Акцизы в год
  const totalExciseKopecks = (fuelExciseKopecks + alcoholExciseKopecks + tobaccoExciseKopecks) * 12

  return Math.round(totalExciseKopecks) / 100 // округляем и конвертируем в рубли
}
