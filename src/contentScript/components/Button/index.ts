import { html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { WCWaves } from '../Waves'
import { styleMap } from 'lit/directives/style-map.js'
import { classMap } from 'lit/directives/class-map.js'
import { IconOptions } from '../Icons'

export interface WCButtonOptions {
  size: 'small' | 'normal' | 'large'
}

@customElement('wc-button')
export class WCButton extends WCWaves {
  static styles = [
    ...WCWaves.styles,
    css`
      :host {
        cursor: pointer;
      }
      :host .wcButton {
        border: none;
        background: none;
        display: block;
      }

      :host .wcButton:hover {
        background-color: var(--theme-background-hover);
      }

      :host .wcButton--danger:hover {
        background-color: var(--theme-danger);
        --theme-icon: var(--theme-invertIcon);
      }

      :host .wcButton--disabled {
        --theme-icon: var(--theme-color-disabled);
        cursor: default;
        color: var(--theme-color-disabled) !important;
        background-color: transparent !important;
      }

      :host .waves-effect {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    `,
  ]

  /** 按钮大小 */
  @property({ type: String })
  size: WCButtonOptions['size'] = 'normal'

  /** 是否禁用 */
  @property({ type: Boolean }) disabled: boolean = false

  /** 危险按钮 */
  @property({ type: Boolean })
  danger: boolean = false

  /** icon 按钮 */
  @property({ type: String })
  icon: IconOptions['name'] | undefined = undefined

  /** icon 按钮大小 */
  @property({ type: Number })
  iconSize: number = 24

  /** icon 按钮颜色 */
  @property({ type: String })
  iconColor: string | undefined = undefined

  constructor() {
    super()
  }

  /** 根据 size 属性获取对应的数组 */
  getValueBySize() {
    let size = 12
    switch (this.size) {
      case 'small':
        size = 4
        break
      case 'normal':
        size = 8
        break
      case 'large':
        size = 12
        break
    }

    return size
  }

  /** 点击事件 */
  onClick(e: MouseEvent) {
    if (this.disabled) {
      e.stopPropagation()
    }
  }

  /** 渲染内容 */
  ContentRender() {
    if (this.icon) {
      const color = this.iconColor
      return html`<wc-icon .name=${this.icon} .size=${this.iconSize} .color=${color}></wc-icon>`
    }

    return html`<slot></slot>`
  }

  render() {
    const style = { padding: `${this.getValueBySize()}px` }
    const classes = {
      'waves-effect': true,
      wcButton: true,
      'wcButton--danger': this.danger === true,
      'waves-red': this.danger === true,
      'waves-effect-disabled': this.disabled === true,
      'wcButton--disabled': this.disabled === true,
    }

    return html`<div class=${classMap(classes)} style=${styleMap(style)} @click=${this.onClick}>
      ${this.ContentRender()}
    </div>`
  }
}
