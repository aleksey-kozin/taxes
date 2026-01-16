import type { UserProfile, TaxRules, CalculationResult, TaxBreakdownItem } from '@/types'
import { calcNdflProgressive } from './ndfl'
import { calcEmployerContrib } from './employerContrib'
import { calcPropertyTaxes } from './property'
import { calcVatEstimate, calcExciseTaxes } from './indirect'
import { calcGrossFromNet } from './grossFromNet'
import { calcSelfEmploymentTax } from './selfEmployment'

/**
 * Агрегатор всех расчётов
 * Возвращает полную детализацию и итоги
 */
export function calcTotals(profile: UserProfile, rules: TaxRules): CalculationResult {
  // Определяем годовой доход (для НДФЛ)
  let annualIncome: number
  let grossSalary: number
  
  if (profile.salaryType === 'gross') {
    // Если зарплата gross, то это доход до вычета НДФЛ
    grossSalary = profile.salary
    annualIncome = profile.salary * 12 + profile.otherIncome
  } else {
    // Если зарплата net, нужно восстановить gross с учетом прогрессивной шкалы
    grossSalary = calcGrossFromNet(profile.salary, profile.otherIncome, rules.ndfl.brackets)
    annualIncome = grossSalary * 12 + profile.otherIncome
  }

  // Расчёт НДФЛ
  const ndflResult = calcNdflProgressive(annualIncome, rules.ndfl.brackets)
  const ndfl = ndflResult.total

  // Расчёт взносов работодателя (используем уже вычисленный grossSalary)
  const employerContribResult = calcEmployerContrib(grossSalary, rules.employerContrib)
  const employerContrib = employerContribResult.total

  // Расчёт имущественных налогов
  const propertyTaxes = calcPropertyTaxes(profile)

  // Расчёт НДС
  const vat = calcVatEstimate(profile.monthlySpending, rules.indirect.vatRate)

  // Расчёт акцизов
  const excise = calcExciseTaxes(profile, rules.indirect)

  // Расчёт НПД (самозанятость)
  const selfEmploymentTax = calcSelfEmploymentTax(profile.selfEmployment)

  // Определяем режим подсчета (по умолчанию 'withEmployer')
  const mode = profile.calculationMode || 'withEmployer'

  // Итого налогов (в зависимости от режима)
  const totalTaxes = mode === 'withEmployer'
    ? ndfl + employerContrib + propertyTaxes + vat + excise + selfEmploymentTax
    : ndfl + propertyTaxes + vat + excise + selfEmploymentTax

  // На руки (доход минус НДФЛ)
  const netIncome = annualIncome - ndfl

  // Эффективная нагрузка (%)
  // В знаменателе: стоимость работы (net + налоги и взносы)
  const workCost = mode === 'withEmployer' 
    ? netIncome + ndfl + employerContrib // на руки + НДФЛ + взносы работодателя
    : netIncome + ndfl // на руки + НДФЛ
  const effectiveRate = workCost > 0 ? (totalTaxes / workCost) * 100 : 0

  // Детализация
  const breakdown: TaxBreakdownItem[] = [
    {
      category: 'НДФЛ',
      amount: Math.round(ndfl),
      description: 'Налог на доходы физических лиц',
      details: ndflResult.breakdown,
    },
    ...(mode === 'withEmployer' ? [{
      category: 'Взносы работодателя',
      amount: Math.round(employerContrib),
      description: 'Страховые взносы: пенсионные (22% до базы, 10% сверх), медицинское (5.1%), социальное (2.9%), травматизм (0.2%)',
      employerContribDetails: employerContribResult.breakdown,
    }] : []),
    ...(selfEmploymentTax > 0 ? [{
      category: 'НПД (самозанятость)',
      amount: Math.round(selfEmploymentTax),
      description: 'Налог на профессиональный доход (4% от физ лиц, 6% от юр лиц)',
    }] : []),
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
