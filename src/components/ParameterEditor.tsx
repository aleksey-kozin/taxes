import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { Tooltip } from './ui/tooltip'
import { useTaxStore } from '@/store/useTaxStore'
import { profiles } from '@/profiles'
import type { SalaryType } from '@/types'

export function ParameterEditor() {
  const { profile, updateProfile } = useTaxStore()
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Не удалось скопировать ссылку:', err)
    }
  }

  const handleChange = (field: string, value: number | string | boolean) => {
    if (field.includes('.')) {
      const parts = field.split('.')
      if (parts.length === 2) {
        const [parent, child] = parts
        const parentValue = profile[parent as keyof typeof profile] as any
        updateProfile({
          [parent]: {
            ...(parentValue || {}),
            [child]: value,
          },
        } as any)
      } else if (parts.length === 3) {
        // Для вложенных полей типа selfEmployment.incomeFromIndividuals
        const [parent, child, grandchild] = parts
        const parentValue = profile[parent as keyof typeof profile] as any
        updateProfile({
          [parent]: {
            ...(parentValue || {}),
            [child]: {
              ...(parentValue?.[child] || {}),
              [grandchild]: value,
            },
          },
        } as any)
      }
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

        {/* Самозанятость */}
        <div className="space-y-2 border rounded-md p-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="hasSelfEmployment"
              checked={profile.selfEmployment?.hasSelfEmployment || false}
              onChange={(e) => {
                handleChange('selfEmployment.hasSelfEmployment', e.target.checked)
              }}
              className="h-4 w-4"
            />
            <Label htmlFor="hasSelfEmployment" className="cursor-pointer">
              Есть самозанятость
            </Label>
          </div>
          {profile.selfEmployment?.hasSelfEmployment && (
            <div className="pl-6 space-y-2">
              <div>
                <Label htmlFor="incomeFromIndividuals" className="text-xs">
                  Доход от физ лиц в год (₽) - ставка 4%
                </Label>
                <Input
                  id="incomeFromIndividuals"
                  type="number"
                  value={profile.selfEmployment?.incomeFromIndividuals || 0}
                  onChange={(e) =>
                    handleChange('selfEmployment.incomeFromIndividuals', parseFloat(e.target.value) || 0)
                  }
                />
              </div>
              <div>
                <Label htmlFor="incomeFromLegalEntities" className="text-xs">
                  Доход от юр лиц в год (₽) - ставка 6%
                </Label>
                <Input
                  id="incomeFromLegalEntities"
                  type="number"
                  value={profile.selfEmployment?.incomeFromLegalEntities || 0}
                  onChange={(e) =>
                    handleChange('selfEmployment.incomeFromLegalEntities', parseFloat(e.target.value) || 0)
                  }
                />
              </div>
            </div>
          )}
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
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Опциональные расходы</h3>
          
          {/* Алкоголь */}
          <div className="space-y-2 border rounded-md p-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="hasAlcohol"
                checked={profile.optionalExpenses?.hasAlcohol || false}
                onChange={(e) => {
                  handleChange('optionalExpenses.hasAlcohol', e.target.checked)
                }}
                className="h-4 w-4"
              />
              <Label htmlFor="hasAlcohol" className="cursor-pointer">
                Покупаю алкоголь
              </Label>
            </div>
            {profile.optionalExpenses?.hasAlcohol && (
              <div className="pl-6 space-y-2">
                <div>
                  <Label htmlFor="beer05PerMonth" className="text-xs">
                    Пиво 0.5л в месяц (шт)
                  </Label>
                  <Input
                    id="beer05PerMonth"
                    type="number"
                    value={profile.optionalExpenses?.beer05PerMonth || 0}
                    onChange={(e) =>
                      handleChange('optionalExpenses.beer05PerMonth', parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="wine07PerMonth" className="text-xs">
                    Вино 0.7л в месяц (шт)
                  </Label>
                  <Input
                    id="wine07PerMonth"
                    type="number"
                    value={profile.optionalExpenses?.wine07PerMonth || 0}
                    onChange={(e) =>
                      handleChange('optionalExpenses.wine07PerMonth', parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="vodka05PerMonth" className="text-xs">
                    Водка 0.5л в месяц (шт)
                  </Label>
                  <Input
                    id="vodka05PerMonth"
                    type="number"
                    value={profile.optionalExpenses?.vodka05PerMonth || 0}
                    onChange={(e) =>
                      handleChange('optionalExpenses.vodka05PerMonth', parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
              </div>
            )}
          </div>

          {/* Сигареты */}
          <div className="space-y-2 border rounded-md p-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="hasCigarettes"
                checked={profile.optionalExpenses?.hasCigarettes || false}
                onChange={(e) => {
                  handleChange('optionalExpenses.hasCigarettes', e.target.checked)
                }}
                className="h-4 w-4"
              />
              <Label htmlFor="hasCigarettes" className="cursor-pointer">
                Покупаю сигареты
              </Label>
            </div>
            {profile.optionalExpenses?.hasCigarettes && (
              <div className="pl-6 space-y-2">
                <div>
                  <Label htmlFor="cigPacksPerMonth" className="text-xs">
                    Пачек в месяц (шт)
                  </Label>
                  <Input
                    id="cigPacksPerMonth"
                    type="number"
                    value={profile.optionalExpenses?.cigPacksPerMonth || 0}
                    onChange={(e) =>
                      handleChange('optionalExpenses.cigPacksPerMonth', parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="cigPackPrice" className="text-xs">
                    Цена пачки (₽)
                  </Label>
                  <Input
                    id="cigPackPrice"
                    type="number"
                    value={profile.optionalExpenses?.cigPackPrice || 0}
                    onChange={(e) =>
                      handleChange('optionalExpenses.cigPackPrice', parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
              </div>
            )}
          </div>

          {/* Автомобиль */}
          <div className="space-y-2 border rounded-md p-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="hasCar"
                checked={profile.optionalExpenses?.hasCar || false}
                onChange={(e) => {
                  handleChange('optionalExpenses.hasCar', e.target.checked)
                }}
                className="h-4 w-4"
              />
              <Label htmlFor="hasCar" className="cursor-pointer">
                Есть автомобиль
              </Label>
            </div>
            {profile.optionalExpenses?.hasCar && (
              <div className="pl-6 space-y-2">
                <div>
                  <Label htmlFor="gasSpendMonthly" className="text-xs">
                    Трачу на бензин в месяц (₽)
                  </Label>
                  <Input
                    id="gasSpendMonthly"
                    type="number"
                    value={profile.optionalExpenses?.gasSpendMonthly || 0}
                    onChange={(e) =>
                      handleChange('optionalExpenses.gasSpendMonthly', parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="dieselSpendMonthly" className="text-xs">
                    Трачу на дизель в месяц (₽)
                  </Label>
                  <Input
                    id="dieselSpendMonthly"
                    type="number"
                    value={profile.optionalExpenses?.dieselSpendMonthly || 0}
                    onChange={(e) =>
                      handleChange('optionalExpenses.dieselSpendMonthly', parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Имущественные налоги */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Имущественные налоги</h3>
          
          {/* Квартира */}
          <div className="space-y-2 border rounded-md p-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="hasApartment"
                checked={profile.propertyTaxes?.hasApartment || false}
                onChange={(e) => {
                  handleChange('propertyTaxes.hasApartment', e.target.checked)
                }}
                className="h-4 w-4"
              />
              <Label htmlFor="hasApartment" className="cursor-pointer">
                Есть квартира
              </Label>
            </div>
            {profile.propertyTaxes?.hasApartment && (
              <div className="pl-6 space-y-2">
                <div>
                  <Label htmlFor="apartmentArea" className="text-xs">
                    Площадь (м²)
                  </Label>
                  <Input
                    id="apartmentArea"
                    type="number"
                    value={profile.propertyTaxes?.apartmentArea || 0}
                    onChange={(e) =>
                      handleChange('propertyTaxes.apartmentArea', parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="apartmentCadastralValue" className="text-xs">
                    Кадастровая стоимость (₽)
                  </Label>
                  <Input
                    id="apartmentCadastralValue"
                    type="number"
                    value={profile.propertyTaxes?.apartmentCadastralValue || 0}
                    onChange={(e) =>
                      handleChange('propertyTaxes.apartmentCadastralValue', parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="apartmentRate" className="text-xs">
                    Ставка налога (%)
                  </Label>
                  <Input
                    id="apartmentRate"
                    type="number"
                    step="0.1"
                    value={profile.propertyTaxes?.apartmentRate || 0}
                    onChange={(e) =>
                      handleChange('propertyTaxes.apartmentRate', parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
              </div>
            )}
          </div>

          {/* Земельный участок */}
          <div className="space-y-2 border rounded-md p-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="hasLand"
                checked={profile.propertyTaxes?.hasLand || false}
                onChange={(e) => {
                  handleChange('propertyTaxes.hasLand', e.target.checked)
                }}
                className="h-4 w-4"
              />
              <Label htmlFor="hasLand" className="cursor-pointer">
                Есть земельный участок
              </Label>
            </div>
            {profile.propertyTaxes?.hasLand && (
              <div className="pl-6 space-y-2">
                <div>
                  <Label htmlFor="landArea" className="text-xs">
                    Площадь (м²)
                  </Label>
                  <Input
                    id="landArea"
                    type="number"
                    value={profile.propertyTaxes?.landArea || 0}
                    onChange={(e) =>
                      handleChange('propertyTaxes.landArea', parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="landCadastralValue" className="text-xs">
                    Кадастровая стоимость (₽)
                  </Label>
                  <Input
                    id="landCadastralValue"
                    type="number"
                    value={profile.propertyTaxes?.landCadastralValue || 0}
                    onChange={(e) =>
                      handleChange('propertyTaxes.landCadastralValue', parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="landRate" className="text-xs">
                    Ставка налога (%)
                  </Label>
                  <Input
                    id="landRate"
                    type="number"
                    step="0.1"
                    value={profile.propertyTaxes?.landRate || 0}
                    onChange={(e) =>
                      handleChange('propertyTaxes.landRate', parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
              </div>
            )}
          </div>

          {/* Устаревшие поля для обратной совместимости */}
          <div className="space-y-2 border rounded-md p-3 bg-muted/30">
            <Label className="text-xs text-muted-foreground">
              Или укажите суммы напрямую (из уведомлений ФНС)
            </Label>
            <div className="space-y-2">
              <div>
                <Label htmlFor="property" className="text-xs">
                  Налог на имущество в год (₽)
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
                  Транспортный налог в год (₽)
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
                  Земельный налог в год (₽)
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
        </div>

        {/* Профили пользователей */}
        <div className="space-y-2">
          <Label>Готовые профили</Label>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              onClick={() => updateProfile(profiles.poor)}
              className="text-xs"
            >
              Малоимущий
            </Button>
            <Button
              variant="outline"
              onClick={() => updateProfile(profiles.average)}
              className="text-xs"
            >
              Средний
            </Button>
            <Button
              variant="outline"
              onClick={() => updateProfile(profiles.rich)}
              className="text-xs"
            >
              Богатый
            </Button>
          </div>
        </div>

        {/* Кнопка копирования ссылки */}
        <Button
          variant="outline"
          onClick={handleCopyLink}
          className="w-full"
        >
          {copied ? '✓ Ссылка скопирована!' : '📋 Скопировать ссылку'}
        </Button>
      </CardContent>
    </Card>
  )
}
