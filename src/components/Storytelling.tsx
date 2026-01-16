import { Card, CardContent } from './ui/card'
import type { CalculationResult } from '@/types'
import { useTaxStore } from '@/store/useTaxStore'

interface StorytellingProps {
  result: CalculationResult
}

export function Storytelling({ result }: StorytellingProps) {
  const { profile } = useTaxStore()
  const mode = profile.calculationMode || 'withEmployer'

  // На руки в год
  const netYear = result.netIncome

  // Стоимость работы (на руки + налоги и взносы)
  const workCost = mode === 'withEmployer'
    ? netYear + result.ndfl + result.employerContrib
    : netYear + result.ndfl

  // Государство получит
  const stateTake = result.totalTaxes

  // Топ-2 налога
  const topTaxes = [...result.breakdown]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 2)
    .map(item => item.category)

  const topTaxesText = topTaxes.length === 2
    ? `${topTaxes[0]} и ${topTaxes[1]}`
    : topTaxes[0] || 'налоги'

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-3 text-sm leading-relaxed">
          <p>
            За год вы получите на руки{' '}
            <span className="font-semibold">{netYear.toLocaleString('ru-RU')} ₽</span>.
          </p>
          
          {mode === 'withEmployer' && (
            <p>
              Работодатель потратит на вас{' '}
              <span className="font-semibold">{workCost.toLocaleString('ru-RU')} ₽</span>{' '}
              (на руки + налоги и взносы).
            </p>
          )}
          
          <p>
            Из этой суммы государство получит{' '}
            <span className="font-semibold text-destructive">
              {stateTake.toLocaleString('ru-RU')} ₽
            </span>.
          </p>
          
          <p>
            Больше всего уходит на{' '}
            <span className="font-semibold">{topTaxesText}</span>.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
