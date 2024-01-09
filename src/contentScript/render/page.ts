import type { NavigatorPanel } from '../components/NavigatorPlanel'
import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { TitleTree, TitleTreeData } from '../interface'
import { scrollSmoothTo } from '../../utils'
import { TitleTreeComponent } from '../components/TitleTree'
import { getScrollElement } from '../analysis'
import { Ref, createRef, ref } from 'lit/directives/ref.js'
import '../components/TitleTree'
import '../components/NavigatorPlanel'

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

  navigatorPanelRef: Ref<NavigatorPanel> = createRef()

  constructor(props: { rootTree: TitleTree; content: Element }) {
    super()
    this.rootTree = props.rootTree
  }

  /** 全部 展开/闭合 */
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

    // TODO FIX item 过多可能导致在下下一帧才会完成所有的更新，从而导致此次scrollUpdate调用过早。
    /** 所有 item 闭合后，导致 scroll 变化，需要主动调用更新 */
    requestAnimationFrame(() => {
      this.navigatorPanelRef.value?.scrollUpdate()
    })
  }

  /** 全部展开 Icon */
  allExpandIcon() {
    const iconName = this.isAllDisplay ? 'allCollapse' : 'allExpand'

    return html` <wc-button class="header_allCollapse" @click=${() => this.onToggleAllDisplay()}>
      <wc-icon class="header_icon" name=${iconName} size="16" color="#999"></wc-icon>
    </wc-button>`
  }

  /** 点击树的 item */
  onClickTreeItem(params: Parameters<Exclude<TitleTreeComponent['onClickItem'], undefined>>[0]) {
    const container = getScrollElement(params.target)

    scrollSmoothTo({ target: params.target, container })
  }

  /** 点击树的 item icon */
  onclickTreeItemIcon() {
    requestAnimationFrame(() => {
      this.navigatorPanelRef.value?.scrollUpdate()
    })
  }

  render() {
    if (this.rootTree === null) return

    return html`<div>
      <navigator-panel ref=${ref(this.navigatorPanelRef)} .extraIcon=${[this.allExpandIcon()]}>
        <title-tree
          .rootTree=${this.rootTree}
          .onClickItem=${this.onClickTreeItem}
          .onClickItemIcon=${() => this.onclickTreeItemIcon()}
        >
        </title-tree>
      </navigator-panel>
    </div>`
  }
}
