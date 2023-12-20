/// <reference types="vite/client" />

import type { WCButton } from './contentScript/components/Button'
import type { WCIcon } from './contentScript/components/Icons'

declare const __APP_VERSION__: string

type UnionByObjectValues<T extends Record<string, any>> = T[keyof T]

declare global {
  interface HTMLElementTagNameMap {
    'wc-icon': WCIcon
    'wc-button': WCButton
  }
}
