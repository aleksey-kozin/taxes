import type { UserProfile } from '@/types'

/**
 * Расчёт имущественных налогов
 * Простое суммирование годовых сумм из профиля
 */
export function calcPropertyTaxes(profile: UserProfile): number {
  if (!profile.propertyTaxes) {
    return 0
  }

  const { property = 0, transport = 0, land = 0 } = profile.propertyTaxes
  return property + transport + land
}
