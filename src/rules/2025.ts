import type { TaxRules, UserProfile } from '@/types'

export const rules2025: TaxRules = {
  year: 2025,
  ndfl: {
    brackets: [
      { threshold: 0, rate: 0.13 }, // 13% до 2,400,000
      { threshold: 2_400_000, rate: 0.15 }, // 15% на часть 2,400,000 - 5,000,000
      { threshold: 5_000_000, rate: 0.18 }, // 18% на часть 5,000,000 - 20,000,000
      { threshold: 20_000_000, rate: 0.20 }, // 20% на часть 20,000,000 - 50,000,000
      { threshold: 50_000_000, rate: 0.22 }, // 22% на часть свыше 50,000,000
    ],
  },
  employerContrib: {
    baseRate: 0.30, // 30% (для обратной совместимости)
    reducedRate: 0.151, // 15.1% (для обратной совместимости)
    limitBase: 2_759_000, // предельная база в 2025 году
    rates: {
      pension: 0.22, // 22% до базы, 10% сверх (пересчитывается в calcEmployerContrib)
      medical: 0.051, // 5.1%
      social: 0.029, // 2.9%
      injury: 0.002, // 0.2%
    },
  },
  indirect: {
    vatRate: 0.22, // эффективная доля НДС в расходах (22% для 2026 года)
    exciseRates: {
      fuel: 0.40, // примерно 40% акциза в цене топлива
      alcohol: 0.50, // примерно 50% акциза в цене алкоголя
      tobacco: 0.60, // примерно 60% акциза в цене табака
    },
  },
}

// Профиль "Средний россиянин" по умолчанию
export const defaultProfile: UserProfile = {
  salary: 100_000, // средняя зарплата в месяц
  salaryType: 'net', // зарплата на руки по умолчанию
  otherIncome: 0,
  monthlySpending: 50_000, // средние траты в месяц
  optionalExpenses: {
    hasCar: true,
    gasSpendMonthly: 5_000, // траты на бензин
    dieselSpendMonthly: 0,
    hasAlcohol: true,
    beer05PerMonth: 8, // пример: 8 бутылок пива в месяц
    wine07PerMonth: 1, // пример: 1 бутылка вина в месяц
    vodka05PerMonth: 1, // пример: 1 бутылка водки в месяц
    hasCigarettes: false,
    cigPacksPerMonth: 0,
    cigPackPrice: 0,
  },
  propertyTaxes: {
    hasApartment: false,
    hasLand: false,
    property: 3_000, // налог на имущество в год (для обратной совместимости)
    transport: 2_000, // транспортный налог в год
    land: 0,
  },
  calculationMode: 'withEmployer', // по умолчанию включая работодателя
}
