import { describe, it, expect } from 'vitest'
import { calcTotals } from '@/lib/calculations/totals'
import { rules2025 } from '@/rules/2025'
import type { UserProfile } from '@/types'

describe('calcTotals', () => {
  it('должен рассчитать итоги для базового профиля', () => {
    const profile: UserProfile = {
      salary: 100_000,
      salaryType: 'gross',
      otherIncome: 0,
      monthlySpending: 80_000,
      optionalExpenses: {
        fuel: 5_000,
        alcohol: 2_000,
        tobacco: 0,
      },
      propertyTaxes: {
        property: 3_000,
        transport: 2_000,
        land: 0,
      },
    }

    const result = calcTotals(profile, rules2025)

    expect(result).toHaveProperty('netIncome')
    expect(result).toHaveProperty('totalTaxes')
    expect(result).toHaveProperty('effectiveRate')
    expect(result).toHaveProperty('breakdown')
    expect(result.breakdown.length).toBeGreaterThan(0)
  })

  it('должен корректно обрабатывать зарплату net', () => {
    const profile: UserProfile = {
      salary: 87_000, // net (примерно 100,000 gross)
      salaryType: 'net',
      otherIncome: 0,
      monthlySpending: 80_000,
    }

    const result = calcTotals(profile, rules2025)

    // Проверяем, что расчёт выполнен
    expect(result.totalTaxes).toBeGreaterThan(0)
    expect(result.netIncome).toBeGreaterThan(0)
  })

  it('должен включить все категории налогов в breakdown', () => {
    const profile: UserProfile = {
      salary: 100_000,
      salaryType: 'gross',
      otherIncome: 0,
      monthlySpending: 80_000,
      optionalExpenses: {
        fuel: 5_000,
        alcohol: 2_000,
        tobacco: 1_000,
      },
      propertyTaxes: {
        property: 3_000,
        transport: 2_000,
        land: 1_000,
      },
    }

    const result = calcTotals(profile, rules2025)

    const categories = result.breakdown.map((item) => item.category)
    expect(categories).toContain('НДФЛ')
    expect(categories).toContain('Взносы работодателя')
    expect(categories).toContain('Имущественные налоги')
    expect(categories).toContain('НДС')
    expect(categories).toContain('Акцизы')
  })

  it('должен корректно рассчитать эффективную нагрузку', () => {
    const profile: UserProfile = {
      salary: 100_000,
      salaryType: 'gross',
      otherIncome: 0,
      monthlySpending: 80_000,
    }

    const result = calcTotals(profile, rules2025)

    // Эффективная нагрузка рассчитывается как totalTaxes / workCost * 100
    // где workCost = netIncome + ndfl + employerContrib (в режиме withEmployer)
    const workCost = result.netIncome + result.ndfl + result.employerContrib
    const expectedRate = workCost > 0 ? (result.totalTaxes / workCost) * 100 : 0

    expect(Math.abs(result.effectiveRate - expectedRate)).toBeLessThan(0.1)
  })

  it('должен обрабатывать профиль без опциональных расходов', () => {
    const profile: UserProfile = {
      salary: 100_000,
      salaryType: 'gross',
      otherIncome: 0,
      monthlySpending: 80_000,
    }

    const result = calcTotals(profile, rules2025)

    expect(result.excise).toBe(0)
    expect(result.totalTaxes).toBeGreaterThan(0)
  })

  it('должен обрабатывать профиль без имущественных налогов', () => {
    const profile: UserProfile = {
      salary: 100_000,
      salaryType: 'gross',
      otherIncome: 0,
      monthlySpending: 80_000,
    }

    const result = calcTotals(profile, rules2025)

    expect(result.propertyTaxes).toBe(0)
  })
})
