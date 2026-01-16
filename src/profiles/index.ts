import type { UserProfile } from '@/types'

/**
 * Профиль "Малоимущий россиянин"
 * Зарплата ниже среднего, минимальные расходы
 */
export const poorProfile: UserProfile = {
  salary: 50_000, // зарплата на руки
  salaryType: 'net',
  otherIncome: 0,
  monthlySpending: 30_000,
  optionalExpenses: {
    hasCar: false,
    gasSpendMonthly: 0,
    dieselSpendMonthly: 0,
    hasAlcohol: false,
    beer05PerMonth: 0,
    wine07PerMonth: 0,
    vodka05PerMonth: 0,
    hasCigarettes: false,
    cigPacksPerMonth: 0,
    cigPackPrice: 0,
  },
  propertyTaxes: {
    hasApartment: false,
    hasLand: false,
    property: 1_000,
    transport: 0,
    land: 0,
  },
  calculationMode: 'withEmployer',
}

/**
 * Профиль "Средний россиянин"
 * Средняя зарплата, средние расходы
 */
export const averageProfile: UserProfile = {
  salary: 100_000, // зарплата на руки
  salaryType: 'net',
  otherIncome: 0,
  monthlySpending: 50_000,
  optionalExpenses: {
    hasCar: true,
    gasSpendMonthly: 5_000,
    dieselSpendMonthly: 0,
    hasAlcohol: true,
    beer05PerMonth: 8,
    wine07PerMonth: 1,
    vodka05PerMonth: 1,
    hasCigarettes: false,
    cigPacksPerMonth: 0,
    cigPackPrice: 0,
  },
  propertyTaxes: {
    hasApartment: false,
    hasLand: false,
    property: 3_000,
    transport: 2_000,
    land: 0,
  },
  calculationMode: 'withEmployer',
}

/**
 * Профиль "Богатый россиянин"
 * Высокая зарплата, значительные расходы
 */
export const richProfile: UserProfile = {
  salary: 300_000, // зарплата на руки
  salaryType: 'net',
  otherIncome: 0,
  monthlySpending: 150_000,
  optionalExpenses: {
    hasCar: true,
    gasSpendMonthly: 15_000,
    dieselSpendMonthly: 0,
    hasAlcohol: true,
    beer05PerMonth: 12,
    wine07PerMonth: 3,
    vodka05PerMonth: 2,
    hasCigarettes: false,
    cigPacksPerMonth: 0,
    cigPackPrice: 0,
  },
  propertyTaxes: {
    hasApartment: true,
    apartmentArea: 80,
    apartmentCadastralValue: 15_000_000,
    apartmentRate: 0.1,
    hasLand: false,
    property: 10_000,
    transport: 8_000,
    land: 5_000,
  },
  calculationMode: 'withEmployer',
}

export const profiles = {
  poor: poorProfile,
  average: averageProfile,
  rich: richProfile,
}
