import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { useTaxStore } from '@/store/useTaxStore'

interface AssumptionsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AssumptionsModal({ isOpen, onClose }: AssumptionsModalProps) {
  const { rules, updateRules } = useTaxStore()
  const [localRules, setLocalRules] = useState(rules.indirect)

  if (!isOpen) return null

  const handleSave = () => {
    updateRules({
      indirect: localRules,
    })
    onClose()
  }

  const handleCancel = () => {
    setLocalRules(rules.indirect)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Настроить допущения</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vatRate">Доля НДС в расходах (%)</Label>
            <Input
              id="vatRate"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={(localRules.vatRate * 100).toFixed(2)}
              onChange={(e) =>
                setLocalRules({
                  ...localRules,
                  vatRate: parseFloat(e.target.value) / 100 || 0,
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fuelExcise">Доля акциза в топливе (%)</Label>
            <Input
              id="fuelExcise"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={(localRules.exciseRates.fuel * 100).toFixed(2)}
              onChange={(e) =>
                setLocalRules({
                  ...localRules,
                  exciseRates: {
                    ...localRules.exciseRates,
                    fuel: parseFloat(e.target.value) / 100 || 0,
                  },
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="alcoholExcise">Доля акциза в алкоголе (%)</Label>
            <Input
              id="alcoholExcise"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={(localRules.exciseRates.alcohol * 100).toFixed(2)}
              onChange={(e) =>
                setLocalRules({
                  ...localRules,
                  exciseRates: {
                    ...localRules.exciseRates,
                    alcohol: parseFloat(e.target.value) / 100 || 0,
                  },
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tobaccoExcise">Доля акциза в табаке (%)</Label>
            <Input
              id="tobaccoExcise"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={(localRules.exciseRates.tobacco * 100).toFixed(2)}
              onChange={(e) =>
                setLocalRules({
                  ...localRules,
                  exciseRates: {
                    ...localRules.exciseRates,
                    tobacco: parseFloat(e.target.value) / 100 || 0,
                  },
                })
              }
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} className="flex-1">
              Сохранить
            </Button>
            <Button variant="outline" onClick={handleCancel} className="flex-1">
              Отмена
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
