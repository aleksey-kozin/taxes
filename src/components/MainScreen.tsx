import { lazy, Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Tooltip } from './ui/tooltip'
import { Button } from './ui/button'
import { useTaxStore } from '@/store/useTaxStore'
import type { CalculationMode } from '@/types'

// Lazy load heavy components for code splitting
const TaxBreakdown = lazy(() => import('./TaxBreakdown').then(m => ({ default: m.TaxBreakdown })))
const Storytelling = lazy(() => import('./Storytelling').then(m => ({ default: m.Storytelling })))
const ChartsSection = lazy(() => import('./charts/ChartsSection').then(m => ({ default: m.ChartsSection })))

// Loading fallback component
const ComponentLoader = () => (
  <div className="flex items-center justify-center h-32">
    <div className="text-muted-foreground">Загрузка...</div>
  </div>
)

export function MainScreen() {
  const { result, profile, updateProfile } = useTaxStore()
  const mode = profile.calculationMode || 'withEmployer'

  if (!result) {
    return (
      <div className="container mx-auto p-4">
        <p>Загрузка...</p>
      </div>
    )
  }

  const handleModeChange = (newMode: CalculationMode) => {
    updateProfile({ calculationMode: newMode })
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Налоги гражданина РФ</h1>
        
        {/* Переключатель режимов */}
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <span className="text-sm text-muted-foreground whitespace-nowrap">Режим подсчета:</span>
          <div className="flex border rounded-md w-full sm:w-auto">
            <Button
              variant={mode === 'personal' ? 'default' : 'ghost'}
              onClick={() => handleModeChange('personal')}
              className="rounded-r-none rounded-l-md flex-1 sm:flex-initial text-xs sm:text-sm px-2 sm:px-4"
            >
              Только из дохода
            </Button>
            <Button
              variant={mode === 'withEmployer' ? 'default' : 'ghost'}
              onClick={() => handleModeChange('withEmployer')}
              className="rounded-l-none rounded-r-md flex-1 sm:flex-initial text-xs sm:text-sm px-2 sm:px-4"
            >
              Включая работодателя
            </Button>
          </div>
        </div>
      </div>

      {/* Пояснение режима */}
      {mode === 'withEmployer' && (
        <Card className="bg-muted/50">
          <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
            <p className="text-sm text-muted-foreground">
              Взносы работодателя платит работодатель, но они являются частью стоимости вашей работы. 
              Государство получает эти деньги благодаря вам: нет сотрудника — не будет и взносов.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Большой виджет с итогами */}
      <Card className="bg-primary/5 border-2 border-primary/20">
        <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Государство получило</p>
            <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-destructive break-words px-2">
              {result.totalTaxes.toLocaleString('ru-RU')} ₽
            </p>
            <p className="text-sm text-muted-foreground mt-1">в год</p>
          </div>
        </CardContent>
      </Card>

      {/* Блок "Итого" */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">
              <Tooltip content="Доход после вычета НДФЛ">
                На руки
              </Tooltip>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold break-words">
              {result.netIncome.toLocaleString('ru-RU')} ₽
            </div>
            <p className="text-sm text-muted-foreground">в год</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">
              <Tooltip content="Сумма всех налогов и взносов: НДФЛ, взносы работодателя, имущественные, НДС, акцизы">
                Налоги/взносы
              </Tooltip>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-destructive break-words">
              {result.totalTaxes.toLocaleString('ru-RU')} ₽
            </div>
            <p className="text-sm text-muted-foreground">в год</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">
              <Tooltip content="Процент налогов от общего дохода (налоги / доход × 100%)">
                Эффективная нагрузка
              </Tooltip>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold">
              {result.effectiveRate.toFixed(1)}%
            </div>
            <p className="text-sm text-muted-foreground">от дохода</p>
          </CardContent>
        </Card>
      </div>

      {/* Сторителлинг */}
      <Suspense fallback={<ComponentLoader />}>
        <Storytelling result={result} />
      </Suspense>

      {/* Графики с вкладками */}
      <Suspense fallback={<ComponentLoader />}>
        <ChartsSection result={result} />
      </Suspense>

      {/* Расшифровка */}
      <Suspense fallback={<ComponentLoader />}>
        <TaxBreakdown result={result} />
      </Suspense>
    </div>
  )
}
