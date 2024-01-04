import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { StyleInfo, styleMap } from 'lit/directives/style-map.js'
import '../components/TitleTree'
import '../components/NavigatorPlanel'

import { TitleTree, TitleTreeData } from '../interface'

interface WCPageOptions {}

/**
 * 页面
 */
@customElement('wc-page')
export class WCPage extends LitElement {
  static styles = [
    css`
      :host {
      }
    `,
  ]

  @property({ type: Object })
  rootTree: TitleTree

  @property({ type: Boolean })
  isAllDisplay: boolean = true

  constructor(props: { rootTree: TitleTree }) {
    super()
    this.rootTree = props.rootTree
  }

  /**  */
  onToggleAllDisplay() {
    this.isAllDisplay = !this.isAllDisplay

    this.rootTree.children.forEach((tree) => {
      tree.eachChild((node) => {
        if (!node.data) return
        node.data.isDisplay = this.isAllDisplay
        node.data.TitleItem?.requestUpdate()
      })
      if (!tree.data) return
      tree.data.TitleItem?.requestUpdate()
    })
  }

  allExpandIcon() {
    const iconName = this.isAllDisplay ? 'allCollapse' : 'allExpand'

    return html` <wc-button class="header_allCollapse" @click=${() => this.onToggleAllDisplay()}>
      <wc-icon class="header_icon" name=${iconName} size="16" color="#999"></wc-icon>
    </wc-button>`
  }

  render() {
    if (this.rootTree === null) return

    return html`<div>
      <navigator-panel .extraIcon=${[this.allExpandIcon()]}>
        <title-tree .rootTree=${this.rootTree}> </title-tree>
      </navigator-panel>
    </div>`
  }
}
