import type { NdflBracket } from '@/types'
import { calcNdflProgressive } from './ndfl'

/**
 * Восстанавливает gross зарплату из net с учетом прогрессивной шкалы НДФЛ
 * Использует бинарный поиск для точного расчета
 * 
 * @param netSalary - зарплата на руки в месяц (руб)
 * @param otherIncome - прочие доходы в год (руб)
 * @param brackets - прогрессивная шкала НДФЛ
 * @returns gross зарплата в месяц (руб)
 */
export function calcGrossFromNet(
  netSalary: number,
  otherIncome: number,
  brackets: NdflBracket[]
): number {
  const netYear = netSalary * 12
  const tolerance = 0.01 // точность в рублях
  
  // Начальные границы для бинарного поиска
  // Минимум: net (если нет налогов)
  // Максимум: net * 2 (если налог 50%)
  let minGross = netYear
  let maxGross = netYear * 2
  
  // Бинарный поиск
  while (maxGross - minGross > tolerance) {
    const testGross = (minGross + maxGross) / 2
    const annualIncome = testGross + otherIncome
    const ndflResult = calcNdflProgressive(annualIncome, brackets)
    const calculatedNet = annualIncome - ndflResult.total
    
    if (Math.abs(calculatedNet - netYear) < tolerance) {
      // Нашли точное значение
      return testGross / 12
    }
    
    if (calculatedNet < netYear) {
      // Нужно больше gross, чтобы получить нужный net
      minGross = testGross
    } else {
      // Нужно меньше gross
      maxGross = testGross
    }
  }
  
  // Возвращаем среднее значение
  return (minGross + maxGross) / 2 / 12
}
