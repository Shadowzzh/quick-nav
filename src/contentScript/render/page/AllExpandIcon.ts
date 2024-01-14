import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import type { TitleTreeData } from '@/contentScript/interface'

import { Tree } from '@/utils/models'

@customElement('wc-page-all-expand-icon')
export class WCPageThemeIcon extends LitElement {
  /** 图标大小 */
  @property({ type: Number })
  private iconSize = 16

  /** 是否全部展开 */
  @property({ type: Boolean })
  private isAllDisplay: boolean = true

  /** 当前展示的深度 */
  @property({ type: Number })
  private currentShowDepth: number = 0

  /** 最大深度 */
  @property({ type: Number })
  private depthMax: number = 0

  /** 最小深度 */
  @property({ type: Number })
  private depthMin: number = 0

  /** 根节点 */
  @property({ type: Object })
  private rootTree: Tree<TitleTreeData> | undefined = undefined

  /** 点击全部展开时 - 触发*/
  private onClickAllExpand: () => void = () => {}

  /** 全部的 item 展开｜闭合 */
  onToggleAllDisplay() {
    if (!this.rootTree) return
    const isAllDisplay = !this.isAllDisplay

    // 根节点只有一个字节点时
    const isOneChild = this.rootTree.children.length === 1
    // 根节点只有一个字节点时，使用子节点的子节点
    const baseTree = isOneChild ? this.rootTree.children[0].children : this.rootTree.children
    // 全部展开时，展示最大深度，否则展示 1
    this.currentShowDepth = isAllDisplay ? this.depthMax : this.depthMin

    baseTree.forEach((tree) => {
      // 根节点不参与
      tree.eachChild((node) => {
        if (!node.data) return

        node.data.isDisplay = isAllDisplay
        node.data.TitleItem?.requestUpdate()
      })
    })

    this.isAllDisplay = isAllDisplay
    this.onClickAllExpand()
  }

  /** 获取 icon 的名称 */
  getIconName() {
    return this.isAllDisplay ? 'allCollapse' : 'allExpand'
  }

  render() {
    const iconName = this.getIconName()
    const disabled = this.depthMax === this.depthMin

    return html` <wc-button
      class="header_allCollapse"
      @click=${() => this.onToggleAllDisplay()}
      .disabled=${disabled}
    >
      <wc-icon
        class="header_icon"
        name=${iconName}
        size=${this.iconSize}
        color="var(--theme-icon)"
      ></wc-icon>
    </wc-button>`
  }
}
