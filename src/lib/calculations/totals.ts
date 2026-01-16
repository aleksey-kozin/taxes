import type { UserProfile, TaxRules, CalculationResult, TaxBreakdownItem } from '@/types'
import { calcNdflProgressive } from './ndfl'
import { calcEmployerContrib } from './employerContrib'
import { calcPropertyTaxes } from './property'
import { calcVatEstimate, calcExciseTaxes } from './indirect'

/**
 * Агрегатор всех расчётов
 * Возвращает полную детализацию и итоги
 */
export function calcTotals(profile: UserProfile, rules: TaxRules): CalculationResult {
  // Определяем годовой доход
  let annualIncome: number
  if (profile.salaryType === 'gross') {
    // Если зарплата gross, то это доход до вычета НДФЛ
    annualIncome = profile.salary * 12 + profile.otherIncome
  } else {
    // Если зарплата net, нужно восстановить gross
    // net = gross * (1 - 0.13) для базовой ставки
    // Упрощённо: gross = net / 0.87
    const grossSalary = profile.salary / 0.87
    annualIncome = grossSalary * 12 + profile.otherIncome
  }

  // Расчёт НДФЛ
  const ndflResult = calcNdflProgressive(annualIncome, rules.ndfl.brackets)
  const ndfl = ndflResult.total

  // Определяем gross зарплату для расчёта взносов
  const grossSalary = profile.salaryType === 'gross' 
    ? profile.salary 
    : profile.salary / 0.87

  // Расчёт взносов работодателя
  const employerContrib = calcEmployerContrib(grossSalary, rules.employerContrib)

  // Расчёт имущественных налогов
  const propertyTaxes = calcPropertyTaxes(profile)

  // Расчёт НДС
  const vat = calcVatEstimate(profile.monthlySpending, rules.indirect.vatRate)

  // Расчёт акцизов
  const excise = calcExciseTaxes(profile, rules.indirect)

  // Итого налогов
  const totalTaxes = ndfl + employerContrib + propertyTaxes + vat + excise

  // На руки (доход минус НДФЛ)
  const netIncome = annualIncome - ndfl

  // Эффективная нагрузка (%)
  const effectiveRate = annualIncome > 0 ? (totalTaxes / annualIncome) * 100 : 0

  // Детализация
  const breakdown: TaxBreakdownItem[] = [
    {
      category: 'НДФЛ',
      amount: Math.round(ndfl),
      description: 'Налог на доходы физических лиц',
      details: ndflResult.breakdown,
    },
    {
      category: 'Взносы работодателя',
      amount: Math.round(employerContrib),
      description: 'Страховые взносы (30% до предельной базы, 15.1% сверх)',
    },
    {
      category: 'Имущественные налоги',
      amount: Math.round(propertyTaxes),
      description: 'Налог на имущество, транспортный, земельный',
    },
    {
      category: 'НДС',
      amount: Math.round(vat),
      description: `Оценочный НДС в расходах (${(rules.indirect.vatRate * 100).toFixed(1)}%)`,
    },
    {
      category: 'Акцизы',
      amount: Math.round(excise),
      description: 'Акцизы на топливо, алкоголь, табак',
    },
  ]

  return {
    netIncome: Math.round(netIncome),
    totalTaxes: Math.round(totalTaxes),
    effectiveRate: Math.round(effectiveRate * 100) / 100, // округление до 2 знаков
    breakdown,
    ndfl: Math.round(ndfl),
    employerContrib: Math.round(employerContrib),
    propertyTaxes: Math.round(propertyTaxes),
    vat: Math.round(vat),
    excise: Math.round(excise),
  }
}
