import type { EmployerContribRules } from '@/types'

/**
 * Расчёт страховых взносов работодателя
 * 30% до предельной базы, 15.1% сверх
 * Все расчёты в копейках (integer), возврат в рублях
 */
export function calcEmployerContrib(
  salary: number, // зарплата в месяц (руб)
  rules: EmployerContribRules
): number {
  const annualSalary = salary * 12
  const limitBaseKopecks = Math.round(rules.limitBase * 100)
  const annualSalaryKopecks = Math.round(annualSalary * 100)

  let totalContribKopecks = 0

  if (annualSalaryKopecks <= limitBaseKopecks) {
    // Вся зарплата в пределах предельной базы
    totalContribKopecks = Math.round(annualSalaryKopecks * rules.baseRate)
  } else {
    // Часть до предельной базы по базовому тарифу
    const basePartKopecks = Math.round(limitBaseKopecks * rules.baseRate)
    
    // Часть сверх предельной базы по пониженному тарифу
    const excessKopecks = annualSalaryKopecks - limitBaseKopecks
    const excessPartKopecks = Math.round(excessKopecks * rules.reducedRate)
    
    totalContribKopecks = basePartKopecks + excessPartKopecks
  }

  return Math.round(totalContribKopecks / 100) // округляем и конвертируем в рубли
}
