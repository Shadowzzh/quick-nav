import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import type { TitleTreeData } from '@/contentScript/interface'
import type { Tree } from '@/utils/models'

@customElement('wc-page-all-expand-icon')
export class WCPageAllExpandIcon extends LitElement {
  /** 图标大小 */
  @property({ type: Number })
  iconSize = 16

  /** 是否全部展开 */
  @property({ type: Boolean })
  isAllDisplay: boolean = true

  /** 当前展示的深度 */
  @property({ type: Number })
  currentShowDepth: number = 0

  /** 最大深度 */
  @property({ type: Number })
  depthMax: number = 0

  /** 最小深度 */
  @property({ type: Number })
  depthMin: number = 0

  /** 根节点 */
  @property({ type: Object })
  rootTree: Tree<TitleTreeData> | undefined = undefined

  /** 点击全部展开时 - 触发*/
  onClickAllExpand: (params: { isAllDisplay: boolean }) => void = () => {}

  /** 全部的 item 展开｜闭合 */
  onToggleAllDisplay() {
    if (!this.rootTree) return
    const isAllDisplay = !this.isAllDisplay

    // 根节点只有一个字节点时
    const isOneChild = this.rootTree.children.length === 1
    // 根节点只有一个字节点时，使用子节点的子节点
    const baseTree = isOneChild ? this.rootTree.children[0].children : this.rootTree.children

    baseTree.forEach((tree) => {
      // 根节点不参与
      tree.eachChild((node) => {
        if (!node.data) return

        node.data.isDisplay = isAllDisplay
        node.data.TitleItem?.requestUpdate()
      })
    })

    this.onClickAllExpand({ isAllDisplay })
  }

  /** 获取 icon 的名称 */
  getIconName() {
    return this.isAllDisplay ? 'allCollapse' : 'allExpand'
  }

  render() {
    const iconName = this.getIconName()
    const disabled = this.depthMax === this.depthMin

    return html` <wc-button
      @click=${() => this.onToggleAllDisplay()}
      .disabled=${disabled}
      .iconSize=${this.iconSize}
      .icon=${iconName}
      iconColor="var(--theme-icon)"
    >
    </wc-button>`
  }
}
