import type { UserProfile } from '@/types'

/**
 * Расчёт имущественных налогов
 * Использует детализированные данные или устаревшие поля для обратной совместимости
 */
export function calcPropertyTaxes(profile: UserProfile): number {
  if (!profile.propertyTaxes) {
    return 0
  }

  const taxes = profile.propertyTaxes
  let total = 0

  // Налог на квартиру (если указаны детали)
  if (taxes.hasApartment && taxes.apartmentCadastralValue && taxes.apartmentRate) {
    const apartmentTax = (taxes.apartmentCadastralValue * taxes.apartmentRate) / 100
    total += apartmentTax
  }

  // Земельный налог (если указаны детали)
  if (taxes.hasLand && taxes.landCadastralValue && taxes.landRate) {
    const landTax = (taxes.landCadastralValue * taxes.landRate) / 100
    total += landTax
  }

  // Устаревшие поля для обратной совместимости
  total += taxes.property || 0
  total += taxes.transport || 0
  total += taxes.land || 0

  return Math.round(total)
}
