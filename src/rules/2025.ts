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
    baseRate: 0.30, // 30%
    reducedRate: 0.151, // 15.1%
    limitBase: 2_759_000, // предельная база в 2025 году
  },
  indirect: {
    vatRate: 0.13, // эффективная доля НДС в расходах (13% по умолчанию)
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
  salaryType: 'gross',
  otherIncome: 0,
  monthlySpending: 50_000, // средние траты в месяц
  optionalExpenses: {
    fuel: 5_000, // траты на топливо
    alcohol: 2_000, // траты на алкоголь
    tobacco: 0,
  },
  propertyTaxes: {
    property: 3_000, // налог на имущество в год
    transport: 2_000, // транспортный налог в год
    land: 0,
  },
}
