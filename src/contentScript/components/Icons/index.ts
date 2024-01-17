import { LitElement, html, css, CSSResult, svg, TemplateResult } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { StyleInfo, styleMap } from 'lit/directives/style-map.js'
import {
  dragSvg,
  arrowRightSvg,
  arrowDownSvg,
  allExpandSvg,
  allCollapseSvg,
  sunLightSvg,
  moonLightSvg,
  ZoomInSvg,
  ZoomOutSvg,
  searcherSvg,
  refreshSvg,
  closeSvg,
  moreSvg,
} from './svgs'

const iconMap = {
  drag: { svg: dragSvg },
  arrowRight: { svg: arrowRightSvg },
  arrowDown: { svg: arrowDownSvg },
  allExpand: { svg: allExpandSvg },
  allCollapse: { svg: allCollapseSvg },
  sunLight: { svg: sunLightSvg },
  moonLight: { svg: moonLightSvg },
  zoomIn: { svg: ZoomInSvg },
  zoomOut: { svg: ZoomOutSvg },
  searcher: { svg: searcherSvg },
  refresh: { svg: refreshSvg },
  more: { svg: moreSvg },
  close: { svg: closeSvg },
}

/** 图标组件类型 */

export interface IconOptions {
  /**图标名称 */
  name: keyof typeof iconMap
  /**图标大小 */
  size?: number
  /**图标颜色 */
  color?: string
}

/** 图标组件 */
@customElement('wc-icon')
export class WCIcon extends LitElement {
  static styles = [
    css`
      :host {
        display: block-inline;
      }

      :host svg {
        width: 100%;
        height: 100%;
      }
    `,
  ]

  @property({ type: String })
  name: IconOptions['name'] = 'drag'

  @property({ type: Number })
  size: number | undefined = 24

  @property({ type: String })
  color: string | undefined

  @property({ type: Array })
  styles: Readonly<StyleInfo> = {}

  constructor() {
    super()
  }

  /** 根据 name 属性获取对应的 iconOptions */
  getIconByName(name: IconOptions['name']) {
    const iconOption = iconMap[name]
    if (!iconOption) return { svg: svg`</svg>` }

    return iconOption
  }

  render() {
    this.styles = { height: `${this.size}px`, width: `${this.size}px`, color: 'currentColor' }
    this.color && (this.style.color = `${this.color}`)

    return html`<div style=${styleMap(this.styles)}>${this.getIconByName(this.name).svg}</div>`
  }
}
