import { html, css, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { styleMap } from 'lit/directives/style-map.js'
import type { TitleTree } from '../../interface'

export interface WCTitleItemOptions {}

@customElement('wc-title-item')
export class WCTitleItem extends LitElement {
  static styles = [
    css`
      :host {
        color: #3b3b3b;
      }
      :host .title_children {
        padding-left: 10px;
      }
      :host .title {
        cursor: pointer;
        padding: 3px;
      }

      :host .title:hover {
        background-color: #e6f7ff;
      }
    `,
  ]

  @property({ type: Object })
  node: TitleTree | null = null

  constructor(options: WCTitleItem) {
    super()
  }

  render() {
    if (!this.node) return
    const element = this.node?.data?.element
    if (!element) return

    return html`<div class="titleWrap">
      <div class="title" unique=${this.node.uniqueId}>${element.innerText}</div>
      ${this.children.length ? html`<div class="title_children">${this.children}</div>` : null}
    </div> `
  }
}
