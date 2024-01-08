import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import '../components/TitleTree'
import '../components/NavigatorPlanel'

import { TitleTree, TitleTreeData } from '../interface'
import { scrollSmoothTo } from '../../utils'
import { TitleTreeComponent } from '../components/TitleTree'

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

  constructor(props: { rootTree: TitleTree; content: Element }) {
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

  /** 点击树的 item */
  onClickTreeItem(params: Parameters<Exclude<TitleTreeComponent['onClickItem'], undefined>>[0]) {
    scrollSmoothTo({ target: params.target })
  }

  render() {
    if (this.rootTree === null) return

    return html`<div>
      <navigator-panel .extraIcon=${[this.allExpandIcon()]}>
        <title-tree .rootTree=${this.rootTree} .onClickItem=${this.onClickTreeItem}> </title-tree>
      </navigator-panel>
    </div>`
  }
}
