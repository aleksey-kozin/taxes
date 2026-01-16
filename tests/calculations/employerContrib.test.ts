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
    // 1,200,000 × (0.22 + 0.051 + 0.029 + 0.002) = 1,200,000 × 0.302 = 362,400
    expect(result.total).toBe(362_400)
    expect(result.breakdown).toHaveProperty('pension')
    expect(result.breakdown).toHaveProperty('medical')
    expect(result.breakdown).toHaveProperty('social')
    expect(result.breakdown).toHaveProperty('injury')
  })

  it('должен рассчитать взносы на границе предельной базы', () => {
    // Предельная база 2,759,000 в год = 229,916.67 в месяц
    const monthlySalary = 229_916.67
    const result = calcEmployerContrib(monthlySalary, rules2025)
    // 2,759,000 × (0.22 + 0.051 + 0.029 + 0.002) = 2,759,000 × 0.302 = 833,218
    expect(Math.round(result.total)).toBe(833_218)
  })

  it('должен рассчитать взносы чуть выше предельной базы (маржинально)', () => {
    // Зарплата 250,000 в месяц = 3,000,000 в год
    const monthlySalary = 250_000
    const result = calcEmployerContrib(monthlySalary, rules2025)
    // До базы: 2,759,000 × (0.22 + 0.051 + 0.029 + 0.002) = 833,218
    // Сверх базы: 241,000 × (0.10 + 0.051 + 0.029 + 0.002) = 241,000 × 0.182 = 43,862
    // Итого: 833,218 + 43,862 = 877,080
    expect(Math.round(result.total)).toBe(877_080)
  })

  it('должен рассчитать взносы значительно выше предельной базы', () => {
    // Зарплата 500,000 в месяц = 6,000,000 в год
    const monthlySalary = 500_000
    const result = calcEmployerContrib(monthlySalary, rules2025)
    // До базы: 2,759,000 × (0.22 + 0.051 + 0.029 + 0.002) = 833,218
    // Сверх базы: 3,241,000 × (0.10 + 0.051 + 0.029 + 0.002) = 3,241,000 × 0.182 = 589,862
    // Итого: 833,218 + 589,862 = 1,423,080
    expect(Math.round(result.total)).toBe(1_423_080)
  })

  it('должен вернуть 0 для нулевой зарплаты', () => {
    const monthlySalary = 0
    const result = calcEmployerContrib(monthlySalary, rules2025)
    expect(result.total).toBe(0)
    expect(result.breakdown.total).toBe(0)
  })

  it('должен корректно округлять результаты', () => {
    const monthlySalary = 123_456.78
    const result = calcEmployerContrib(monthlySalary, rules2025)
    // Проверяем, что результат округлён до рублей
    expect(result.total).toBe(Math.round(result.total))
  })
})
