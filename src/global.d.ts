/// <reference types="vite/client" />

import type { WCButton } from './contentScript/components/Button'
import type { WCIcon } from './contentScript/components/Icons'
import type { WCScroll } from './contentScript/components/Scrollbar'
import type { WCTitleItem } from './contentScript/components/TitleTree/TitleItem'
import type { WCNavigatorPanel } from './contentScript/components/NavigatorPanel'
import type { WCPage } from './contentScript/render/page'
import type { WCPageThemeIcon } from './contentScript/render/page/ThemeIcon'
import type { WCPageAllExpandIcon } from './contentScript/render/page/AllExpandIcon'
import type { WCPageZoomIcon } from './contentScript/render/page/ZoomIcon'

declare const __APP_VERSION__: string

type UnionByObjectValues<T extends Record<string, any>> = T[keyof T]

declare global {
  interface HTMLElementTagNameMap {
    'wc-icon': WCIcon
    'wc-button': WCButton
    'wc-scroll': WCScroll
    'wc-title-item': WCTitleItem
    'wc-page': WCPage
    'wc-page-zoom-icon': WCPageZoomIcon
    'wc-page-all-expand-icon': WCPageAllExpandIcon
    'wc-navigator-panel': WCNavigatorPanel
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
