import { html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { WCWaves } from '../Waves'
import { styleMap } from 'lit/directives/style-map.js'

export interface WCButtonOptions {
  size: 'small' | 'normal' | 'large'
}

@customElement('wc-button')
export class WCButton extends WCWaves {
  static styles = [
    ...WCWaves.styles,
    css`
      :host button {
        border: none;
        cursor: pointer;
        background: none;
        display: block;
      }

      :host .waves-effect {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    `,
  ]

  @property({ type: String })
  size: WCButtonOptions['size'] = 'normal'

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

  render() {
    const style = { padding: `${this.getValueBySize()}px` }

    return html`<button class="wc-button waves-effect" style=${styleMap(style)}>
      ${this.children}
    </button>`
  }
}
