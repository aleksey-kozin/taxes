import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { Tooltip } from './ui/tooltip'
import { useTaxStore } from '@/store/useTaxStore'
import type { SalaryType } from '@/types'

export function ParameterEditor() {
  const { profile, updateProfile, resetProfile } = useTaxStore()
  const [showOptional, setShowOptional] = useState(false)

  const handleChange = (field: string, value: number | string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      updateProfile({
        [parent]: {
          ...(profile[parent as keyof typeof profile] as object),
          [child]: value,
        },
      } as any)
    } else {
      updateProfile({ [field]: value } as any)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Параметры профиля</CardTitle>
        <CardDescription>
          Измените параметры для расчёта налогов
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Зарплата */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="salary">Зарплата в месяц</Label>
            <Tooltip content="Введите вашу зарплату. Выберите тип: gross (до вычета НДФЛ) или net (на руки)">
              <span className="text-xs text-muted-foreground cursor-help">(?)</span>
            </Tooltip>
          </div>
          <div className="flex gap-2">
            <Input
              id="salary"
              type="number"
              value={profile.salary}
              onChange={(e) => handleChange('salary', parseFloat(e.target.value) || 0)}
              className="flex-1"
            />
            <select
              value={profile.salaryType}
              onChange={(e) => handleChange('salaryType', e.target.value as SalaryType)}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="gross">Gross</option>
              <option value="net">Net</option>
            </select>
          </div>
        </div>

        {/* Прочие доходы */}
        <div className="space-y-2">
          <Label htmlFor="otherIncome">Прочие доходы в год (₽)</Label>
          <Input
            id="otherIncome"
            type="number"
            value={profile.otherIncome}
            onChange={(e) => handleChange('otherIncome', parseFloat(e.target.value) || 0)}
          />
        </div>

        {/* Ежемесячные траты */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="spending">Ежемесячные траты (₽)</Label>
            <Tooltip content="Общие ежемесячные расходы для расчёта НДС">
              <span className="text-xs text-muted-foreground cursor-help">(?)</span>
            </Tooltip>
          </div>
          <Input
            id="spending"
            type="number"
            value={profile.monthlySpending}
            onChange={(e) => handleChange('monthlySpending', parseFloat(e.target.value) || 0)}
          />
        </div>

        {/* Опциональные расходы */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setShowOptional(!showOptional)}
            className="text-sm font-medium text-primary hover:underline"
          >
            {showOptional ? '▼' : '▶'} Опциональные расходы (топливо, алкоголь, табак)
          </button>
          {showOptional && (
            <div className="pl-4 space-y-3 border-l-2">
              <div className="space-y-2">
                <Label htmlFor="fuel">Траты на топливо в месяц (₽)</Label>
                <Input
                  id="fuel"
                  type="number"
                  value={profile.optionalExpenses?.fuel || 0}
                  onChange={(e) =>
                    handleChange('optionalExpenses.fuel', parseFloat(e.target.value) || 0)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="alcohol">Траты на алкоголь в месяц (₽)</Label>
                <Input
                  id="alcohol"
                  type="number"
                  value={profile.optionalExpenses?.alcohol || 0}
                  onChange={(e) =>
                    handleChange('optionalExpenses.alcohol', parseFloat(e.target.value) || 0)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tobacco">Траты на табак в месяц (₽)</Label>
                <Input
                  id="tobacco"
                  type="number"
                  value={profile.optionalExpenses?.tobacco || 0}
                  onChange={(e) =>
                    handleChange('optionalExpenses.tobacco', parseFloat(e.target.value) || 0)
                  }
                />
              </div>
            </div>
          )}
        </div>

        {/* Имущественные налоги */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label>Имущественные налоги в год (₽)</Label>
            <Tooltip content="Посмотрите суммы в уведомлениях ФНС">
              <span className="text-xs text-muted-foreground cursor-help">(?)</span>
            </Tooltip>
          </div>
          <div className="space-y-2">
            <div>
              <Label htmlFor="property" className="text-xs">
                Налог на имущество
              </Label>
              <Input
                id="property"
                type="number"
                value={profile.propertyTaxes?.property || 0}
                onChange={(e) =>
                  handleChange('propertyTaxes.property', parseFloat(e.target.value) || 0)
                }
              />
            </div>
            <div>
              <Label htmlFor="transport" className="text-xs">
                Транспортный налог
              </Label>
              <Input
                id="transport"
                type="number"
                value={profile.propertyTaxes?.transport || 0}
                onChange={(e) =>
                  handleChange('propertyTaxes.transport', parseFloat(e.target.value) || 0)
                }
              />
            </div>
            <div>
              <Label htmlFor="land" className="text-xs">
                Земельный налог
              </Label>
              <Input
                id="land"
                type="number"
                value={profile.propertyTaxes?.land || 0}
                onChange={(e) =>
                  handleChange('propertyTaxes.land', parseFloat(e.target.value) || 0)
                }
              />
            </div>
          </div>
        </div>

        {/* Кнопка сброса */}
        <Button variant="outline" onClick={resetProfile} className="w-full">
          Сбросить к профилю "Средний россиянин"
        </Button>
      </CardContent>
    </Card>
  )
}
