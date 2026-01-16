import type { SelfEmploymentIncome } from '@/types'

/**
 * Расчёт НПД (налог на профессиональный доход) для самозанятых
 * Ставки: 4% от дохода от физ лиц, 6% от дохода от юр лиц
 */
export function calcSelfEmploymentTax(
  selfEmployment: SelfEmploymentIncome | undefined
): number {
  if (!selfEmployment || !selfEmployment.hasSelfEmployment) {
    return 0
  }

  const incomeFromIndividuals = selfEmployment.incomeFromIndividuals || 0
  const incomeFromLegalEntities = selfEmployment.incomeFromLegalEntities || 0

  // Конвертируем в копейки для точности
  const individualsKopecks = Math.round(incomeFromIndividuals * 100)
  const legalEntitiesKopecks = Math.round(incomeFromLegalEntities * 100)

  // Налог: 4% от физ лиц, 6% от юр лиц
  const taxFromIndividualsKopecks = Math.round(individualsKopecks * 0.04)
  const taxFromLegalEntitiesKopecks = Math.round(legalEntitiesKopecks * 0.06)

  const totalTaxKopecks = taxFromIndividualsKopecks + taxFromLegalEntitiesKopecks

  return Math.round(totalTaxKopecks) / 100 // округляем и конвертируем в рубли
}
