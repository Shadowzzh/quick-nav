import { LitElement, html, css, CSSResult, svg, TemplateResult } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { StyleInfo, styleMap } from 'lit/directives/style-map.js'
import { dragSvg } from './svgs'

const iconMap = {
  drag: { svg: dragSvg },
}

interface IconOptions {
  /**图标名称 */
  name: keyof typeof iconMap
  /**图标大小 */
  size?: number
  /**图标颜色 */
  color?: string
}

@customElement('wc-icon')
/**
 * 图标组件
 */
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
  name: IconOptions['name']

  @property({ type: Number })
  size: number | undefined

  @property({ type: String })
  color: string | undefined

  @property({ type: Array })
  styles: Readonly<StyleInfo>

  constructor(option: IconOptions) {
    super()
    this.name = option.name
    this.size = option.size ?? 24
    this.color = option.color

    this.styles = { height: `${this.size}px`, width: `${this.size}px`, color: `${this.color}` }
  }

  /** 根据 name 属性获取对应的 iconOptions */
  getIconByName(name: IconOptions['name']) {
    const iconOption = iconMap[name]
    if (!iconOption) return { svg: svg`</svg>` }

    return iconOption
  }

  render() {
    return html`<div style=${styleMap(this.styles)}>${this.getIconByName(this.name).svg}</div>`
  }
}
