import type { EmployerContribRules, EmployerContribBreakdown } from '@/types'

/**
 * Расчёт страховых взносов работодателя с детализацией по категориям
 * Пенсионные: 22% до базы, 10% сверх
 * Медицинское: 5.1%
 * Социальное: 2.9%
 * Травматизм: 0.2%
 * Все расчёты в копейках (integer), возврат в рублях
 */
export function calcEmployerContrib(
  salary: number, // зарплата в месяц (руб)
  rules: EmployerContribRules
): { total: number; breakdown: EmployerContribBreakdown } {
  const annualSalary = salary * 12
  const limitBaseKopecks = Math.round(rules.limitBase * 100)
  const annualSalaryKopecks = Math.round(annualSalary * 100)

  // Используем детализированные ставки, если они есть, иначе вычисляем из базовых
  const rates = rules.rates || {
    pension: 0.22, // 22% до базы, 10% сверх (будет пересчитано ниже)
    medical: 0.051, // 5.1%
    social: 0.029, // 2.9%
    injury: 0.002, // 0.2%
  }

  let pensionKopecks = 0
  let medicalKopecks = 0
  let socialKopecks = 0
  let injuryKopecks = 0

  if (annualSalaryKopecks <= limitBaseKopecks) {
    // Вся зарплата в пределах предельной базы
    pensionKopecks = Math.round(annualSalaryKopecks * rates.pension)
    medicalKopecks = Math.round(annualSalaryKopecks * rates.medical)
    socialKopecks = Math.round(annualSalaryKopecks * rates.social)
    injuryKopecks = Math.round(annualSalaryKopecks * rates.injury)
  } else {
    // Часть до предельной базы
    pensionKopecks = Math.round(limitBaseKopecks * rates.pension)
    medicalKopecks = Math.round(limitBaseKopecks * rates.medical)
    socialKopecks = Math.round(limitBaseKopecks * rates.social)
    injuryKopecks = Math.round(limitBaseKopecks * rates.injury)
    
    // Часть сверх предельной базы (для пенсионных - 10% вместо 22%)
    const excessKopecks = annualSalaryKopecks - limitBaseKopecks
    const pensionReducedRate = 0.10 // 10% сверх базы
    pensionKopecks += Math.round(excessKopecks * pensionReducedRate)
    medicalKopecks += Math.round(excessKopecks * rates.medical)
    socialKopecks += Math.round(excessKopecks * rates.social)
    injuryKopecks += Math.round(excessKopecks * rates.injury)
  }

  const totalKopecks = pensionKopecks + medicalKopecks + socialKopecks + injuryKopecks

  return {
    total: Math.round(totalKopecks / 100),
    breakdown: {
      pension: Math.round(pensionKopecks / 100),
      medical: Math.round(medicalKopecks / 100),
      social: Math.round(socialKopecks / 100),
      injury: Math.round(injuryKopecks / 100),
      total: Math.round(totalKopecks / 100),
    },
  }
}
