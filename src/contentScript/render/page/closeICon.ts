import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { removeRenderTree } from '..'
import { App } from '@/contentScript/launch'

@customElement('wc-page-close-icon')
export class WCPageCloseIcon extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
  `

  /** 图标大小 */
  @property({ type: Number })
  private iconSize = 16

  /** 关闭 */
  onClose() {
    App.close()
  }

  render() {
    return html` <wc-button
      @click=${() => this.onClose()}
      danger
      icon="close"
      .iconSize=${this.iconSize}
      iconColor="var(--theme-icon)"
    >
    </wc-button>`
  }
}
