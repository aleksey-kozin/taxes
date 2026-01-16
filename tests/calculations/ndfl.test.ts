import { describe, it, expect } from 'vitest'
import { calcNdflProgressive } from '@/lib/calculations/ndfl'
import type { NdflBracket } from '@/types'

const brackets2025: NdflBracket[] = [
  { threshold: 0, rate: 0.13 },
  { threshold: 2_400_000, rate: 0.15 },
  { threshold: 5_000_000, rate: 0.18 },
  { threshold: 20_000_000, rate: 0.20 },
  { threshold: 50_000_000, rate: 0.22 },
]

describe('calcNdflProgressive', () => {
  it('должен рассчитать НДФЛ для дохода ниже первого порога', () => {
    const income = 1_000_000
    const result = calcNdflProgressive(income, brackets2025)
    expect(result.total).toBe(130_000) // 1,000,000 × 0.13
    expect(result.breakdown).toHaveLength(1)
  })

  it('должен рассчитать НДФЛ на границе первого порога (2,400,000)', () => {
    const income = 2_400_000
    const result = calcNdflProgressive(income, brackets2025)
    expect(result.total).toBe(312_000) // 2,400,000 × 0.13
    expect(result.breakdown).toHaveLength(1)
  })

  it('должен рассчитать НДФЛ чуть выше первого порога (маржинально)', () => {
    const income = 2_500_000
    const result = calcNdflProgressive(income, brackets2025)
    // 2,400,000 × 0.13 + 100,000 × 0.15 = 312,000 + 15,000 = 327,000
    expect(result.total).toBe(327_000)
    expect(result.breakdown).toHaveLength(2)
  })

  it('должен рассчитать НДФЛ на границе второго порога (5,000,000)', () => {
    const income = 5_000_000
    const result = calcNdflProgressive(income, brackets2025)
    // 2,400,000 × 0.13 + 2,600,000 × 0.15 = 312,000 + 390,000 = 702,000
    expect(result.total).toBe(702_000)
    expect(result.breakdown).toHaveLength(2)
  })

  it('должен рассчитать НДФЛ чуть выше второго порога', () => {
    const income = 5_100_000
    const result = calcNdflProgressive(income, brackets2025)
    // 2,400,000 × 0.13 + 2,600,000 × 0.15 + 100,000 × 0.18 = 312,000 + 390,000 + 18,000 = 720,000
    expect(result.total).toBe(720_000)
    expect(result.breakdown).toHaveLength(3)
  })

  it('должен рассчитать НДФЛ на границе третьего порога (20,000,000)', () => {
    const income = 20_000_000
    const result = calcNdflProgressive(income, brackets2025)
    // 2,400,000 × 0.13 + 2,600,000 × 0.15 + 15,000,000 × 0.18 = 312,000 + 390,000 + 2,700,000 = 3,402,000
    expect(result.total).toBe(3_402_000)
    expect(result.breakdown).toHaveLength(3)
  })

  it('должен рассчитать НДФЛ на границе четвёртого порога (50,000,000)', () => {
    const income = 50_000_000
    const result = calcNdflProgressive(income, brackets2025)
    // 2,400,000 × 0.13 + 2,600,000 × 0.15 + 15,000,000 × 0.18 + 30,000,000 × 0.20
    // = 312,000 + 390,000 + 2,700,000 + 6,000,000 = 9,402,000
    expect(result.total).toBe(9_402_000)
    expect(result.breakdown).toHaveLength(4)
  })

  it('должен рассчитать НДФЛ выше четвёртого порога', () => {
    const income = 60_000_000
    const result = calcNdflProgressive(income, brackets2025)
    // 2,400,000 × 0.13 + 2,600,000 × 0.15 + 15,000,000 × 0.18 + 30,000,000 × 0.20 + 10,000,000 × 0.22
    // = 312,000 + 390,000 + 2,700,000 + 6,000,000 + 2,200,000 = 11,602,000
    expect(result.total).toBe(11_602_000)
    expect(result.breakdown).toHaveLength(5)
  })

  it('должен вернуть 0 для нулевого дохода', () => {
    const income = 0
    const result = calcNdflProgressive(income, brackets2025)
    expect(result.total).toBe(0)
    expect(result.breakdown).toHaveLength(0)
  })

  it('должен корректно округлять результаты', () => {
    const income = 1_234_567
    const result = calcNdflProgressive(income, brackets2025)
    // Проверяем, что результат округлён до рублей
    expect(result.total).toBe(Math.round(result.total))
  })
})
