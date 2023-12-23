/// <reference types="vite/client" />

import type { WCButton } from './contentScript/components/Button'
import type { WCIcon } from './contentScript/components/Icons'
import type { WCScroll } from './contentScript/components/Scrollbar'

declare const __APP_VERSION__: string

type UnionByObjectValues<T extends Record<string, any>> = T[keyof T]

declare global {
  interface HTMLElementTagNameMap {
    'wc-icon': WCIcon
    'wc-button': WCButton
    'wc-scroll': WCScroll
  }

  /** 深度值 */
  type PathValue<O, Keys extends Array<keyof any>> = Keys extends [infer K, ...infer Rest]
    ? K extends keyof O
      ? Rest extends Array<keyof any>
        ? PathValue<O[K], Rest>
        : never
      : never
    : O
}
