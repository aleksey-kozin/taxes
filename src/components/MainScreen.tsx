import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Tooltip } from './ui/tooltip'
import { Visualization } from './Visualization'
import { TaxBreakdown } from './TaxBreakdown'
import { useTaxStore } from '@/store/useTaxStore'

export function MainScreen() {
  const { result } = useTaxStore()

  if (!result) {
    return (
      <div className="container mx-auto p-4">
        <p>Загрузка...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Налоги гражданина РФ</h1>

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

      {/* Визуализация */}
      <Visualization result={result} />

      {/* Расшифровка */}
      <TaxBreakdown result={result} />
    </div>
  )
}
