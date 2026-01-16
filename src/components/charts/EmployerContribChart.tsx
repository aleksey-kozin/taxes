import { memo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart'
import type { CalculationResult } from '@/types'

interface EmployerContribChartProps {
  result: CalculationResult
}

export const EmployerContribChart = memo(function EmployerContribChart({
  result,
}: EmployerContribChartProps) {
  // Находим взносы работодателя в breakdown
  const employerContribItem = result.breakdown.find(
    (item) => item.category === 'Взносы работодателя'
  )

  if (!employerContribItem || !employerContribItem.employerContribDetails) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Взносы работодателя</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Нет данных для отображения</p>
        </CardContent>
      </Card>
    )
  }

  const details = employerContribItem.employerContribDetails
  const data = [
    {
      name: 'Взносы',
      Пенсионные: details.pension,
      Медицинские: details.medical,
      Социальные: details.social,
      Травматизм: details.injury,
    },
  ]

  const chartConfig = {
    Пенсионные: {
      label: 'Пенсионные',
      color: 'hsl(var(--chart-1))',
    },
    Медицинские: {
      label: 'Медицинские',
      color: 'hsl(var(--chart-2))',
    },
    Социальные: {
      label: 'Социальные',
      color: 'hsl(var(--chart-3))',
    },
    Травматизм: {
      label: 'Травматизм',
      color: 'hsl(var(--chart-4))',
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Структура взносов работодателя</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={80} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => [`${Number(value).toLocaleString('ru-RU')} ₽`, '']}
                />
              }
            />
            <Bar dataKey="Пенсионные" stackId="a" fill="var(--color-Пенсионные)" />
            <Bar dataKey="Медицинские" stackId="a" fill="var(--color-Медицинские)" />
            <Bar dataKey="Социальные" stackId="a" fill="var(--color-Социальные)" />
            <Bar dataKey="Травматизм" stackId="a" fill="var(--color-Травматизм)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
})
