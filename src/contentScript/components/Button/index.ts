import { LitElement, html, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import { TitleTree } from '../../interface'
import { WCWaves } from '../Waves'

export interface WCButtonOptions {}

@customElement('wc-button')
export class WCButton extends WCWaves {
  static styles = [
    ...WCWaves.styles,
    css`
      :host button {
        padding: 0;
        border: none;
        cursor: pointer;
        background: none;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 6px;
      }
    `,
  ]

  constructor(options: WCButtonOptions) {
    super()
    console.log(this.children)
  }

  render() {
    return html`<button class="wc-button waves-effect">${this.children}</button>`
  }
}
