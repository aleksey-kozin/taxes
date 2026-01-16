/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE?: string
  // добавьте другие переменные окружения по необходимости
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
