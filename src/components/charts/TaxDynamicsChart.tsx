import { memo, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart'
import type { CalculationResult, UserProfile } from '@/types'
import { calcTotals } from '@/lib/calculations/totals'
import { useTaxStore } from '@/store/useTaxStore'

interface TaxDynamicsChartProps {
  result: CalculationResult
}

export const TaxDynamicsChart = memo(function TaxDynamicsChart({
  result: _result,
}: TaxDynamicsChartProps) {
  const { profile, rules } = useTaxStore()

  // Генерируем данные для разных значений зарплаты (от 0 до 2x текущей)
  const currentSalary = profile.salary
  const data = useMemo(() => {
    const points: Array<{
      Зарплата: number
      'НДФЛ': number
      'Взносы работодателя': number
      'Всего налогов': number
      'На руки': number
    }> = []

    const step = currentSalary / 20 // 20 точек
    const maxSalary = currentSalary * 2

    for (let salary = 0; salary <= maxSalary; salary += step) {
      const testProfile: UserProfile = {
        ...profile,
        salary: Math.round(salary),
      }
      const testResult = calcTotals(testProfile, rules)

      points.push({
        Зарплата: Math.round(salary),
        'НДФЛ': testResult.ndfl,
        'Взносы работодателя': testResult.employerContrib,
        'Всего налогов': testResult.totalTaxes,
        'На руки': testResult.netIncome,
      })
    }

    return points
  }, [profile, rules, currentSalary])

  const mode = profile.calculationMode || 'withEmployer'

  const chartConfig = {
    'На руки': {
      label: 'На руки',
      color: 'hsl(var(--chart-1))',
    },
    НДФЛ: {
      label: 'НДФЛ',
      color: 'hsl(var(--destructive))',
    },
    'Взносы работодателя': {
      label: 'Взносы работодателя',
      color: 'hsl(var(--chart-2))',
    },
    'Всего налогов': {
      label: 'Всего налогов',
      color: 'hsl(var(--chart-3))',
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Динамика налогов при изменении дохода</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="Зарплата"
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              tick={{ fontSize: 12 }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => [`${Number(value).toLocaleString('ru-RU')} ₽`, '']}
                />
              }
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="На руки"
              stroke="var(--color-На руки)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="НДФЛ"
              stroke="var(--color-НДФЛ)"
              strokeWidth={2}
              dot={false}
            />
            {mode === 'withEmployer' && (
              <Line
                type="monotone"
                dataKey="Взносы работодателя"
                stroke="var(--color-Взносы работодателя)"
                strokeWidth={2}
                dot={false}
              />
            )}
            <Line
              type="monotone"
              dataKey="Всего налогов"
              stroke="var(--color-Всего налогов)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
        <p className="mt-4 text-xs text-muted-foreground">
          Показывает, как меняются налоги при изменении зарплаты от 0 до {currentSalary * 2} ₽
        </p>
      </CardContent>
    </Card>
  )
})
