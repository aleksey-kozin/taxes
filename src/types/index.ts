// Типы для профиля пользователя
export type SalaryType = 'gross' | 'net'

export interface OptionalExpenses {
  fuel?: number // траты на топливо в месяц (руб)
  alcohol?: number // траты на алкоголь в месяц (руб)
  tobacco?: number // траты на табак в месяц (руб)
}

export interface PropertyTaxes {
  property?: number // налог на имущество в год (руб)
  transport?: number // транспортный налог в год (руб)
  land?: number // земельный налог в год (руб)
}

export interface UserProfile {
  // Зарплата
  salary: number // зарплата (руб)
  salaryType: SalaryType // gross или net
  
  // Прочие доходы
  otherIncome: number // прочие доходы в год (руб)
  
  // Расходы
  monthlySpending: number // ежемесячные траты (руб)
  
  // Опциональные расходы
  optionalExpenses?: OptionalExpenses
  
  // Имущественные налоги
  propertyTaxes?: PropertyTaxes
}

// Типы для правил расчёта
export interface NdflBracket {
  threshold: number // порог дохода (руб)
  rate: number // ставка налога (0.13 = 13%)
}

export interface EmployerContribRules {
  baseRate: number // базовый тариф (0.30 = 30%)
  reducedRate: number // пониженный тариф (0.151 = 15.1%)
  limitBase: number // предельная база (руб)
}

export interface IndirectTaxRules {
  vatRate: number // эффективная доля НДС в расходах (0.10-0.16)
  exciseRates: {
    fuel: number // доля акциза в топливе
    alcohol: number // доля акциза в алкоголе
    tobacco: number // доля акциза в табаке
  }
}

export interface TaxRules {
  year: number
  ndfl: {
    brackets: NdflBracket[]
  }
  employerContrib: EmployerContribRules
  indirect: IndirectTaxRules
}

// Типы для результатов расчёта
export interface NdflBreakdown {
  bracket: number // номер брекета
  income: number // доход в этом брекете (руб)
  rate: number // ставка
  tax: number // налог (руб)
}

export interface TaxBreakdownItem {
  category: string // категория налога
  amount: number // сумма (руб)
  description: string // описание "за что"
  details?: NdflBreakdown[] // детализация (для НДФЛ)
}

export interface CalculationResult {
  // Итоги
  netIncome: number // на руки (руб)
  totalTaxes: number // всего налогов/взносов (руб)
  effectiveRate: number // эффективная нагрузка (%)
  
  // Детализация
  breakdown: TaxBreakdownItem[]
  
  // Детали по категориям
  ndfl: number // НДФЛ
  employerContrib: number // взносы работодателя
  propertyTaxes: number // имущественные налоги
  vat: number // НДС
  excise: number // акцизы
}
