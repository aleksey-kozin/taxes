// Типы для профиля пользователя
export type SalaryType = 'gross' | 'net'
export type CalculationMode = 'personal' | 'withEmployer'

export interface OptionalExpenses {
  // Автомобиль
  hasCar?: boolean
  gasSpendMonthly?: number // траты на бензин в месяц (руб)
  dieselSpendMonthly?: number // траты на дизель в месяц (руб)
  
  // Алкоголь
  hasAlcohol?: boolean
  beer05PerMonth?: number // пиво 0.5л в месяц (шт)
  wine07PerMonth?: number // вино 0.7л в месяц (шт)
  vodka05PerMonth?: number // водка 0.5л в месяц (шт)
  
  // Сигареты
  hasCigarettes?: boolean
  cigPacksPerMonth?: number // пачек в месяц
  cigPackPrice?: number // цена пачки (руб)
  
  // Устаревшие поля (для обратной совместимости)
  fuel?: number // траты на топливо в месяц (руб) - использовать gasSpendMonthly + dieselSpendMonthly
  alcohol?: number // траты на алкоголь в месяц (руб) - использовать детализацию
  tobacco?: number // траты на табак в месяц (руб) - использовать cigPacksPerMonth * cigPackPrice
}

export interface PropertyTaxes {
  // Квартира
  hasApartment?: boolean
  apartmentCadastralValue?: number // кадастровая стоимость (руб)
  apartmentArea?: number // площадь (м²)
  apartmentRate?: number // ставка налога (%)
  
  // Земельный участок
  hasLand?: boolean
  landArea?: number // площадь (м²)
  landCadastralValue?: number // кадастровая стоимость (руб)
  landRate?: number // ставка налога (%)
  
  // Устаревшие поля (для обратной совместимости)
  property?: number // налог на имущество в год (руб)
  transport?: number // транспортный налог в год (руб)
  land?: number // земельный налог в год (руб)
}

export interface SelfEmploymentIncome {
  hasSelfEmployment?: boolean
  incomeFromIndividuals?: number // доход от физ лиц в год (ставка 4%)
  incomeFromLegalEntities?: number // доход от юр лиц в год (ставка 6%)
}

export interface UserProfile {
  // Зарплата
  salary: number // зарплата (руб)
  salaryType: SalaryType // gross или net
  
  // Прочие доходы
  otherIncome: number // прочие доходы в год (руб)
  
  // Самозанятость
  selfEmployment?: SelfEmploymentIncome
  
  // Расходы
  monthlySpending: number // ежемесячные траты (руб)
  
  // Опциональные расходы
  optionalExpenses?: OptionalExpenses
  
  // Имущественные налоги
  propertyTaxes?: PropertyTaxes
  
  // Режим подсчета
  calculationMode?: CalculationMode // 'personal' - только из дохода, 'withEmployer' - включая работодателя
}

// Типы для правил расчёта
export interface NdflBracket {
  threshold: number // порог дохода (руб)
  rate: number // ставка налога (0.13 = 13%)
}

export interface EmployerContribRates {
  pension: number // пенсионные взносы (22% до базы, 10% сверх)
  medical: number // медицинское страхование (5.1%)
  social: number // социальное страхование (2.9%)
  injury: number // травматизм (0.2%)
}

export interface EmployerContribRules {
  baseRate: number // базовый тариф (0.30 = 30%) - для обратной совместимости
  reducedRate: number // пониженный тариф (0.151 = 15.1%) - для обратной совместимости
  limitBase: number // предельная база (руб)
  rates?: EmployerContribRates // детализированные ставки
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

export interface EmployerContribBreakdown {
  pension: number // пенсионные взносы
  medical: number // медицинское страхование
  social: number // социальное страхование
  injury: number // травматизм
  total: number // всего
}

export interface TaxBreakdownItem {
  category: string // категория налога
  amount: number // сумма (руб)
  description: string // описание "за что"
  details?: NdflBreakdown[] // детализация (для НДФЛ)
  employerContribDetails?: EmployerContribBreakdown // детализация взносов работодателя
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
