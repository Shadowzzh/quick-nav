/// <reference types="vite/client" />

declare const __APP_VERSION__: string

type UnionByObjectValues<T extends Record<string, any>> = T[keyof T]
