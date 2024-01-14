import { html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { WCWaves } from '../Waves'
import { styleMap } from 'lit/directives/style-map.js'
import { classMap } from 'lit/directives/class-map.js'

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
      :host .wc-button {
        border: none;
        background: none;
        display: block;
      }

      :host .wc-button:hover {
        background-color: var(--theme-background-hover);
      }

      :host .wc-button--disabled {
        /* background-color: var(--theme-background-disabled); */
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

  constructor(options: WCButtonOptions) {
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

  render() {
    const style = { padding: `${this.getValueBySize()}px` }
    const classes = {
      'waves-effect': true,
      'wc-button': true,
      'waves-effect-disabled': this.disabled === true,
      'wc-button--disabled': this.disabled === true,
    }

    return html`<div class=${classMap(classes)} style=${styleMap(style)} @click=${this.onClick}>
      <slot></slot>
    </div>`
  }
}
