import { memo } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart'
import type { CalculationResult } from '@/types'

interface NdflProgressiveChartProps {
  result: CalculationResult
}

export const NdflProgressiveChart = memo(function NdflProgressiveChart({
  result,
}: NdflProgressiveChartProps) {
  // Находим НДФЛ в breakdown
  const ndflItem = result.breakdown.find((item) => item.category === 'НДФЛ')

  if (!ndflItem || !ndflItem.details || ndflItem.details.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Прогрессивная шкала НДФЛ</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Нет данных для отображения</p>
        </CardContent>
      </Card>
    )
  }

  // Создаем данные для графика: накопление налога по брекетам
  let cumulativeTax = 0
  let cumulativeIncome = 0

  const data = ndflItem.details.map((detail) => {
    cumulativeTax += detail.tax
    cumulativeIncome += detail.income
    return {
      Брекет: `Брекет ${detail.bracket}`,
      Налог: detail.tax,
      НакопленныйНалог: cumulativeTax,
      Доход: detail.income,
      НакопленныйДоход: cumulativeIncome,
      Ставка: `${(detail.rate * 100).toFixed(0)}%`,
    }
  })

  const chartConfig = {
    НакопленныйНалог: {
      label: 'Накопленный НДФЛ',
      color: 'hsl(var(--chart-1))',
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Прогрессивная шкала НДФЛ</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="Брекет"
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              tick={{ fontSize: 12 }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => {
                    if (name === 'НакопленныйНалог') {
                      return [`${Number(value).toLocaleString('ru-RU')} ₽`, 'Накопленный НДФЛ']
                    }
                    return [value, name]
                  }}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="НакопленныйНалог"
              stroke="var(--color-НакопленныйНалог)"
              fill="var(--color-НакопленныйНалог)"
              fillOpacity={0.6}
            />
          </AreaChart>
        </ChartContainer>
        <div className="mt-4 space-y-2 text-sm">
          {ndflItem.details.map((detail, index) => (
            <div key={index} className="flex justify-between">
              <span className="text-muted-foreground">
                Брекет {detail.bracket} ({(detail.rate * 100).toFixed(0)}%):
              </span>
              <span className="font-medium">
                {detail.tax.toLocaleString('ru-RU')} ₽
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
})
