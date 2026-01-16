import { memo } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '../ui/chart'
import type { CalculationResult } from '@/types'
import { useTaxStore } from '@/store/useTaxStore'

interface IncomeDistributionChartProps {
  result: CalculationResult
}

export const IncomeDistributionChart = memo(function IncomeDistributionChart({
  result,
}: IncomeDistributionChartProps) {
  const { profile } = useTaxStore()
  const mode = profile.calculationMode || 'withEmployer'

  const employerContrib = mode === 'withEmployer' ? result.employerContrib : 0

  const data = [
    {
      name: 'Распределение',
      'На руки': result.netIncome,
      'НДФЛ': result.ndfl,
      ...(mode === 'withEmployer' ? { 'Взносы работодателя': employerContrib } : {}),
    },
  ]

  const chartConfig = {
    'На руки': {
      label: 'На руки',
      color: 'hsl(var(--chart-1))',
    },
    НДФЛ: {
      label: 'НДФЛ',
      color: 'hsl(var(--destructive))',
    },
    ...(mode === 'withEmployer'
      ? {
          'Взносы работодателя': {
            label: 'Взносы работодателя',
            color: 'hsl(var(--chart-2))',
          },
        }
      : {}),
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Распределение дохода</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={100} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => [`${Number(value).toLocaleString('ru-RU')} ₽`, '']}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="На руки"
              stackId="1"
              stroke="var(--color-На руки)"
              fill="var(--color-На руки)"
            />
            <Area
              type="monotone"
              dataKey="НДФЛ"
              stackId="1"
              stroke="var(--color-НДФЛ)"
              fill="var(--color-НДФЛ)"
            />
            {mode === 'withEmployer' && (
              <Area
                type="monotone"
                dataKey="Взносы работодателя"
                stackId="1"
                stroke="var(--color-Взносы работодателя)"
                fill="var(--color-Взносы работодателя)"
              />
            )}
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
})
