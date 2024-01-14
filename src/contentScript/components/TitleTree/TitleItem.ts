import { html, css, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { StyleInfo, styleMap } from 'lit/directives/style-map.js'
import type { TitleTree, TitleTreeData } from '../../interface'
import '../Icons'
import { Tree } from '../../../utils/models/Tree'

export interface WCTitleItemOptions {}

@customElement('wc-title-item')
export class WCTitleItem extends LitElement {
  static styles = [
    css`
      :host {
        color: #3b3b3b;
      }
      :host .title {
      }
      :host .title_content {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        cursor: pointer;
        padding: 3px;
      }
      :host .title_children {
        padding-left: 18px;
      }
      :host .title_text {
      }

      :host .title_icon {
        margin-right: 2px;
      }

      :host .title_content:hover {
        background-color: #e6f7ff;
      }
    `,
  ]

  private opacity = 1

  @property({ type: Object })
  node: Tree<TitleTreeData> | null = null

  // @property({ type: Boolean })
  // isShowChildren = true

  constructor(options: WCTitleItem) {
    super()
  }

  connectedCallback(): void {
    super.connectedCallback()

    if (this.node) {
      this.opacity = 1 - this.node.depth * 0.15
      if (this.node.data) {
        this.node.data.TitleItem = this
      }
    }
  }

  render() {
    if (!this.node) return
    const element = this.node?.data?.element
    if (!element) return

    const isShowChildren = false

    const style: StyleInfo = {
      opacity: this.opacity,
    }

    const isChildren = this.node.children.length > 0

    const WcIcon = () => {
      if (isChildren === false) return null
      const name = isShowChildren ? 'arrowDown' : 'arrowRight'

      return html`<wc-icon class="title_icon" .name=${name} size="16"></wc-icon>`
    }

    const Children = () => {
      if (isChildren === false || isShowChildren === false) return null

      return html`<div class="title_children">${this.children}</div>`
    }

    return html`<div class="title">
      <div class="title_content" unique=${this.node.uniqueId}>
        ${WcIcon()}
        <div class="title_text" style=${styleMap(style)}>${element.innerText}</div>
      </div>
      ${Children()}
    </div> `
  }
}
