import { memo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'
import { Tooltip } from './ui/tooltip'
import type { CalculationResult } from '@/types'

interface TaxBreakdownProps {
  result: CalculationResult
}

export const TaxBreakdown = memo(function TaxBreakdown({ result }: TaxBreakdownProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Расшифровка налогов</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Категория</TableHead>
              <TableHead className="text-right">Сумма в год</TableHead>
              <TableHead>Описание</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {result.breakdown.map((item) => (
              <TableRow key={item.category}>
                <TableCell className="font-medium">{item.category}</TableCell>
                <TableCell className="text-right">
                  {item.amount.toLocaleString('ru-RU')} ₽
                </TableCell>
                <TableCell>
                  <Tooltip content={item.description}>
                    <span className="cursor-help underline decoration-dotted">
                      {item.description}
                    </span>
                  </Tooltip>
                  {item.details && item.details.length > 0 && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-sm text-muted-foreground">
                        Детализация по брекетам
                      </summary>
                      <div className="mt-2 space-y-1 text-sm">
                        {item.details.map((detail, idx) => (
                          <div key={idx} className="pl-4">
                            Брекет {detail.bracket}: {detail.income.toLocaleString('ru-RU')} ₽ ×{' '}
                            {(detail.rate * 100).toFixed(0)}% ={' '}
                            {detail.tax.toLocaleString('ru-RU')} ₽
                          </div>
                        ))}
                      </div>
                    </details>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
})
