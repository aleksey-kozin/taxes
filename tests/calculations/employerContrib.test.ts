import { describe, it, expect } from 'vitest'
import { calcEmployerContrib } from '@/lib/calculations/employerContrib'
import type { EmployerContribRules } from '@/types'

const rules2025: EmployerContribRules = {
  baseRate: 0.30,
  reducedRate: 0.151,
  limitBase: 2_759_000,
}

describe('calcEmployerContrib', () => {
  it('должен рассчитать взносы для зарплаты ниже предельной базы', () => {
    const monthlySalary = 100_000 // 1,200,000 в год
    const result = calcEmployerContrib(monthlySalary, rules2025)
    expect(result).toBe(360_000) // 1,200,000 × 0.30
  })

  it('должен рассчитать взносы на границе предельной базы', () => {
    // Предельная база 2,759,000 в год = 229,916.67 в месяц
    const monthlySalary = 229_916.67
    const result = calcEmployerContrib(monthlySalary, rules2025)
    // 2,759,000 × 0.30 = 827,700
    expect(Math.round(result)).toBe(827_700)
  })

  it('должен рассчитать взносы чуть выше предельной базы (маржинально)', () => {
    // Зарплата 250,000 в месяц = 3,000,000 в год
    const monthlySalary = 250_000
    const result = calcEmployerContrib(monthlySalary, rules2025)
    // 2,759,000 × 0.30 + (3,000,000 - 2,759,000) × 0.151
    // = 827,700 + 241,000 × 0.151
    // = 827,700 + 36,391 = 864,091
    expect(Math.round(result)).toBe(864_091)
  })

  it('должен рассчитать взносы значительно выше предельной базы', () => {
    // Зарплата 500,000 в месяц = 6,000,000 в год
    const monthlySalary = 500_000
    const result = calcEmployerContrib(monthlySalary, rules2025)
    // 2,759,000 × 0.30 + (6,000,000 - 2,759,000) × 0.151
    // = 827,700 + 3,241,000 × 0.151
    // = 827,700 + 489,391 = 1,317,091
    expect(Math.round(result)).toBe(1_317_091)
  })

  it('должен вернуть 0 для нулевой зарплаты', () => {
    const monthlySalary = 0
    const result = calcEmployerContrib(monthlySalary, rules2025)
    expect(result).toBe(0)
  })

  it('должен корректно округлять результаты', () => {
    const monthlySalary = 123_456.78
    const result = calcEmployerContrib(monthlySalary, rules2025)
    // Проверяем, что результат округлён до рублей
    expect(result).toBe(Math.round(result))
  })
})
