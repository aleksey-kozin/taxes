import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Tooltip } from './ui/tooltip'
import { Button } from './ui/button'
import { Visualization } from './Visualization'
import { TaxBreakdown } from './TaxBreakdown'
import { Storytelling } from './Storytelling'
import { useTaxStore } from '@/store/useTaxStore'
import type { CalculationMode } from '@/types'

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
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Налоги гражданина РФ</h1>
        
        {/* Переключатель режимов */}
        <div className="flex gap-2 items-center">
          <span className="text-sm text-muted-foreground">Режим подсчета:</span>
          <div className="flex border rounded-md">
            <Button
              variant={mode === 'personal' ? 'default' : 'ghost'}
              onClick={() => handleModeChange('personal')}
              className="rounded-r-none rounded-l-md"
            >
              Только из дохода
            </Button>
            <Button
              variant={mode === 'withEmployer' ? 'default' : 'ghost'}
              onClick={() => handleModeChange('withEmployer')}
              className="rounded-l-none rounded-r-md"
            >
              Включая работодателя
            </Button>
          </div>
        </div>
      </div>

      {/* Пояснение режима */}
      {mode === 'withEmployer' && (
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              Взносы работодателя платит работодатель, но они являются частью стоимости вашей работы. 
              Государство получает эти деньги благодаря вам: нет сотрудника — не будет и взносов.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Большой виджет с итогами */}
      <Card className="bg-primary/5 border-2 border-primary/20">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Государство получило</p>
            <p className="text-5xl font-bold text-destructive">
              {result.totalTaxes.toLocaleString('ru-RU')} ₽
            </p>
            <p className="text-sm text-muted-foreground mt-1">в год</p>
          </div>
        </CardContent>
      </Card>

      {/* Блок "Итого" */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              <Tooltip content="Доход после вычета НДФЛ">
                На руки
              </Tooltip>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {result.netIncome.toLocaleString('ru-RU')} ₽
            </div>
            <p className="text-sm text-muted-foreground">в год</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              <Tooltip content="Сумма всех налогов и взносов: НДФЛ, взносы работодателя, имущественные, НДС, акцизы">
                Налоги/взносы
              </Tooltip>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">
              {result.totalTaxes.toLocaleString('ru-RU')} ₽
            </div>
            <p className="text-sm text-muted-foreground">в год</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              <Tooltip content="Процент налогов от общего дохода (налоги / доход × 100%)">
                Эффективная нагрузка
              </Tooltip>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {result.effectiveRate.toFixed(1)}%
            </div>
            <p className="text-sm text-muted-foreground">от дохода</p>
          </CardContent>
        </Card>
      </div>

      {/* Сторителлинг */}
      <Storytelling result={result} />

      {/* Визуализация */}
      <Visualization result={result} />

      {/* Расшифровка */}
      <TaxBreakdown result={result} />
    </div>
  )
}
