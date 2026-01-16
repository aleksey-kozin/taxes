import { useState, lazy, Suspense } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import type { CalculationResult } from '@/types'

// Lazy load all chart components for code splitting
const Visualization = lazy(() => import('../Visualization').then(m => ({ default: m.Visualization })))
const EmployerContribChart = lazy(() => import('./EmployerContribChart').then(m => ({ default: m.EmployerContribChart })))
const NdflProgressiveChart = lazy(() => import('./NdflProgressiveChart').then(m => ({ default: m.NdflProgressiveChart })))
const IncomeDistributionChart = lazy(() => import('./IncomeDistributionChart').then(m => ({ default: m.IncomeDistributionChart })))
const TaxComparisonChart = lazy(() => import('./TaxComparisonChart').then(m => ({ default: m.TaxComparisonChart })))
const TaxDynamicsChart = lazy(() => import('./TaxDynamicsChart').then(m => ({ default: m.TaxDynamicsChart })))

// Loading fallback component
const ChartLoader = () => (
  <div className="flex items-center justify-center h-64">
    <div className="text-muted-foreground">Загрузка графика...</div>
  </div>
)

interface ChartsSectionProps {
  result: CalculationResult
}

export function ChartsSection({ result }: ChartsSectionProps) {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 h-auto">
        <TabsTrigger value="overview" className="text-xs sm:text-sm">
          Обзор
        </TabsTrigger>
        <TabsTrigger value="comparison" className="text-xs sm:text-sm">
          Сравнение
        </TabsTrigger>
        <TabsTrigger value="employer" className="text-xs sm:text-sm">
          Взносы
        </TabsTrigger>
        <TabsTrigger value="ndfl" className="text-xs sm:text-sm">
          НДФЛ
        </TabsTrigger>
        <TabsTrigger value="distribution" className="text-xs sm:text-sm">
          Доход
        </TabsTrigger>
        <TabsTrigger value="dynamics" className="text-xs sm:text-sm">
          Динамика
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4 mt-4">
        <Suspense fallback={<ChartLoader />}>
          <Visualization result={result} />
        </Suspense>
      </TabsContent>

      <TabsContent value="comparison" className="mt-4">
        <Suspense fallback={<ChartLoader />}>
          <TaxComparisonChart result={result} />
        </Suspense>
      </TabsContent>

      <TabsContent value="employer" className="mt-4">
        <Suspense fallback={<ChartLoader />}>
          <EmployerContribChart result={result} />
        </Suspense>
      </TabsContent>

      <TabsContent value="ndfl" className="mt-4">
        <Suspense fallback={<ChartLoader />}>
          <NdflProgressiveChart result={result} />
        </Suspense>
      </TabsContent>

      <TabsContent value="distribution" className="mt-4">
        <Suspense fallback={<ChartLoader />}>
          <IncomeDistributionChart result={result} />
        </Suspense>
      </TabsContent>

      <TabsContent value="dynamics" className="mt-4">
        <Suspense fallback={<ChartLoader />}>
          <TaxDynamicsChart result={result} />
        </Suspense>
      </TabsContent>
    </Tabs>
  )
}
