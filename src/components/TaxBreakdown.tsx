import { memo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { AssumptionsModal } from './AssumptionsModal'
import type { CalculationResult } from '@/types'

interface TaxBreakdownProps {
  result: CalculationResult
}

export const TaxBreakdown = memo(function TaxBreakdown({ result }: TaxBreakdownProps) {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())
  const [isAssumptionsModalOpen, setIsAssumptionsModalOpen] = useState(false)

  const toggleCard = (category: string) => {
    const newExpanded = new Set(expandedCards)
    if (newExpanded.has(category)) {
      newExpanded.delete(category)
    } else {
      newExpanded.add(category)
    }
    setExpandedCards(newExpanded)
  }

  const getExampleText = (category: string, amount: number): string | null => {
    // Примеры "что могли оплатить"
    const examples: Record<string, { item: string; cost: number }> = {
      'НДФЛ': { item: 'Зарплата школьного учителя', cost: 71_444 }, // средняя зарплата учителя в месяц
      'Взносы работодателя': { item: 'Социальная пенсия', cost: 13_457 }, // средняя социальная пенсия в месяц
    }

    const example = examples[category]
    if (!example) return null

    const months = Math.round(amount / example.cost)
    if (months === 0) return null

    return `${example.item} за ${months} ${months === 1 ? 'месяц' : months < 5 ? 'месяца' : 'месяцев'}`
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Разбор налогов</h2>
      {result.breakdown
        .filter((item) => item.amount > 0)
        .map((item) => {
          const isExpanded = expandedCards.has(item.category)
          const exampleText = getExampleText(item.category, item.amount)
          const isEstimate = item.category === 'НДС' || item.category === 'Акцизы'

          return (
            <Card key={item.category}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{item.category}</CardTitle>
                    <p className="text-2xl font-bold text-destructive mt-2">
                      {item.amount.toLocaleString('ru-RU')} ₽
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">в год</p>
                  </div>
                  <button
                    onClick={() => toggleCard(item.category)}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {isExpanded ? '▼ Свернуть' : 'Как считали'}
                  </button>
                </div>
              </CardHeader>
            {isExpanded && (
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Как считали</h4>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  {isEstimate && (
                    <p className="text-xs text-muted-foreground mt-1 italic">
                      (оценка)
                    </p>
                  )}
                </div>

                {item.details && item.details.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Детализация по брекетам</h4>
                    <div className="space-y-2 text-sm">
                      {item.details.map((detail, idx) => (
                        <div key={idx} className="pl-4 border-l-2">
                          Брекет {detail.bracket}: {detail.income.toLocaleString('ru-RU')} ₽ ×{' '}
                          {(detail.rate * 100).toFixed(0)}% ={' '}
                          <span className="font-semibold">
                            {detail.tax.toLocaleString('ru-RU')} ₽
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {item.employerContribDetails && (
                  <div>
                    <h4 className="font-semibold mb-2">Детализация взносов</h4>
                    <div className="space-y-2 text-sm">
                      <div className="pl-4 border-l-2">
                        Пенсионные: <span className="font-semibold">
                          {item.employerContribDetails.pension.toLocaleString('ru-RU')} ₽
                        </span>
                      </div>
                      <div className="pl-4 border-l-2">
                        Медицинское страхование: <span className="font-semibold">
                          {item.employerContribDetails.medical.toLocaleString('ru-RU')} ₽
                        </span>
                      </div>
                      <div className="pl-4 border-l-2">
                        Социальное страхование: <span className="font-semibold">
                          {item.employerContribDetails.social.toLocaleString('ru-RU')} ₽
                        </span>
                      </div>
                      <div className="pl-4 border-l-2">
                        Травматизм: <span className="font-semibold">
                          {item.employerContribDetails.injury.toLocaleString('ru-RU')} ₽
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {exampleText && (
                  <div className="bg-muted/50 p-3 rounded-md">
                    <p className="text-sm">
                      <span className="font-semibold">Что могли оплатить вашими деньгами:</span>{' '}
                      {exampleText}
                    </p>
                  </div>
                )}

                {isEstimate && (
                  <div className="text-xs text-muted-foreground">
                    <button
                      onClick={() => setIsAssumptionsModalOpen(true)}
                      className="underline hover:no-underline"
                    >
                      Настроить допущения
                    </button>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        )
      })}
      
      <AssumptionsModal
        isOpen={isAssumptionsModalOpen}
        onClose={() => setIsAssumptionsModalOpen(false)}
      />
    </div>
  )
})
