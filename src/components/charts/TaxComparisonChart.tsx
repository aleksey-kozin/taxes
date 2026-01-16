import { memo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart'
import type { CalculationResult } from '@/types'

interface TaxComparisonChartProps {
  result: CalculationResult
}

export const TaxComparisonChart = memo(function TaxComparisonChart({
  result,
}: TaxComparisonChartProps) {
  const data = result.breakdown
    .filter((item) => item.amount > 0)
    .map((item) => ({
      name: item.category,
      Сумма: item.amount,
    }))
    .sort((a, b) => b.Сумма - a.Сумма)

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Сравнение налогов</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Нет данных для отображения</p>
        </CardContent>
      </Card>
    )
  }

  const chartConfig = {
    Сумма: {
      label: 'Сумма',
      color: 'hsl(var(--chart-1))',
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Сравнение налогов по категориям</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis
              dataKey="name"
              type="category"
              width={120}
              tick={{ fontSize: 12 }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => [`${Number(value).toLocaleString('ru-RU')} ₽`, '']}
                />
              }
            />
            <Bar dataKey="Сумма" fill="var(--color-Сумма)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
})
