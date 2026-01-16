import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserProfile, TaxRules, CalculationResult } from '@/types'
import { rules2025, defaultProfile } from '@/rules/2025'
import { calcTotals } from '@/lib/calculations/totals'

// Debounce функция для оптимизации пересчёта
let recalculateTimeout: ReturnType<typeof setTimeout> | null = null
const DEBOUNCE_MS = 50 // Цель: ≤50 мс, debounce 50 мс для плавности

interface TaxStore {
  profile: UserProfile
  rules: TaxRules
  result: CalculationResult | null
  
  // Actions
  updateProfile: (updates: Partial<UserProfile>) => void
  updateRules: (updates: Partial<TaxRules>) => void
  resetProfile: () => void
  recalculate: () => void
}

// Функция для синхронизации с URL
function syncWithUrl(profile: UserProfile) {
  if (typeof window === 'undefined') return

  const params = new URLSearchParams()
  
  // Сохраняем только ключевые параметры в URL для шаринга
  params.set('salary', profile.salary.toString())
  params.set('salaryType', profile.salaryType)
  params.set('otherIncome', profile.otherIncome.toString())
  params.set('spending', profile.monthlySpending.toString())
  
  if (profile.calculationMode) {
    params.set('mode', profile.calculationMode)
  }
  
  if (profile.optionalExpenses?.fuel) {
    params.set('fuel', profile.optionalExpenses.fuel.toString())
  }
  if (profile.optionalExpenses?.alcohol) {
    params.set('alcohol', profile.optionalExpenses.alcohol.toString())
  }
  if (profile.optionalExpenses?.tobacco) {
    params.set('tobacco', profile.optionalExpenses.tobacco.toString())
  }
  
  if (profile.propertyTaxes?.property) {
    params.set('property', profile.propertyTaxes.property.toString())
  }
  if (profile.propertyTaxes?.transport) {
    params.set('transport', profile.propertyTaxes.transport.toString())
  }
  if (profile.propertyTaxes?.land) {
    params.set('land', profile.propertyTaxes.land.toString())
  }

  const newUrl = `${window.location.pathname}${window.location.hash}?${params.toString()}`
  window.history.replaceState({}, '', newUrl)
}

// Функция для загрузки из URL
function loadFromUrl(): Partial<UserProfile> | null {
  if (typeof window === 'undefined') return null

  const params = new URLSearchParams(window.location.search)
  if (params.toString() === '') return null

  const profile: Partial<UserProfile> = {}

  const salary = params.get('salary')
  if (salary) profile.salary = parseFloat(salary)

  const salaryType = params.get('salaryType')
  if (salaryType === 'gross' || salaryType === 'net') {
    profile.salaryType = salaryType
  }

  const mode = params.get('mode')
  if (mode === 'personal' || mode === 'withEmployer') {
    profile.calculationMode = mode
  }

  const otherIncome = params.get('otherIncome')
  if (otherIncome) profile.otherIncome = parseFloat(otherIncome)

  const spending = params.get('spending')
  if (spending) profile.monthlySpending = parseFloat(spending)

  const fuel = params.get('fuel')
  const alcohol = params.get('alcohol')
  const tobacco = params.get('tobacco')
  if (fuel || alcohol || tobacco) {
    profile.optionalExpenses = {}
    if (fuel) profile.optionalExpenses.fuel = parseFloat(fuel)
    if (alcohol) profile.optionalExpenses.alcohol = parseFloat(alcohol)
    if (tobacco) profile.optionalExpenses.tobacco = parseFloat(tobacco)
  }

  const property = params.get('property')
  const transport = params.get('transport')
  const land = params.get('land')
  if (property || transport || land) {
    profile.propertyTaxes = {}
    if (property) profile.propertyTaxes.property = parseFloat(property)
    if (transport) profile.propertyTaxes.transport = parseFloat(transport)
    if (land) profile.propertyTaxes.land = parseFloat(land)
  }

  return profile
}

export const useTaxStore = create<TaxStore>()(
  persist(
    (set, get) => {
      // Загружаем из URL при инициализации
      const urlProfile = loadFromUrl()
      const initialProfile = urlProfile ? { ...defaultProfile, ...urlProfile } : defaultProfile

      return {
        profile: initialProfile,
        rules: rules2025,
        result: null,

        updateProfile: (updates) => {
          set((state) => {
            const newProfile = { ...state.profile, ...updates }
            syncWithUrl(newProfile)
            return { profile: newProfile }
          })
          // Debounced пересчёт для оптимизации производительности
          if (recalculateTimeout) {
            clearTimeout(recalculateTimeout)
          }
          recalculateTimeout = setTimeout(() => {
            get().recalculate()
          }, DEBOUNCE_MS)
        },

        updateRules: (updates) => {
          set((state) => ({
            rules: { ...state.rules, ...updates },
          }))
          // Пересчитываем после изменения правил
          if (recalculateTimeout) {
            clearTimeout(recalculateTimeout)
          }
          recalculateTimeout = setTimeout(() => {
            get().recalculate()
          }, DEBOUNCE_MS)
        },

        resetProfile: () => {
          set({ profile: defaultProfile })
          syncWithUrl(defaultProfile)
          // Для сброса пересчитываем сразу
          if (recalculateTimeout) {
            clearTimeout(recalculateTimeout)
          }
          get().recalculate()
        },

        recalculate: () => {
          const { profile, rules } = get()
          const startTime = performance.now()
          const result = calcTotals(profile, rules)
          const endTime = performance.now()
          // Логируем время выполнения в dev режиме
          if (process.env.NODE_ENV === 'development' && endTime - startTime > 50) {
            console.warn(`Пересчёт занял ${(endTime - startTime).toFixed(2)} мс`)
          }
          set({ result })
        },
      }
    },
    {
      name: 'tax-profile-storage', // LocalStorage key
      partialize: (state) => ({ profile: state.profile }), // Сохраняем только профиль
    }
  )
)

// Инициализация: пересчитываем при загрузке
if (typeof window !== 'undefined') {
  useTaxStore.getState().recalculate()
}
