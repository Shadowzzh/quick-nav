import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import type { TitleTreeData } from '@/contentScript/interface'
import type { Tree } from '@/utils/models'

@customElement('wc-page-zoom-icon')
export class WCPageZoomIcon extends LitElement {
  /** 图标大小 */
  @property({ type: Number })
  iconSize = 16

  /** 类型 */
  @property({ type: String })
  mode: 'zoomIn' | 'zoomOut' = 'zoomIn'

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

  /** 点击放大镜 - 触发 */
  onClickZoom: (params: { currentShowDepth: number }) => void = () => {}

  /** 获取是否是 disabled */
  getDisabled() {
    if (this.mode === 'zoomIn') {
      return this.depthMax === this.depthMin || this.currentShowDepth === this.depthMax
    } else {
      return this.depthMax === this.depthMin || this.currentShowDepth === this.depthMin
    }
  }

  /** 放大缩小 */
  onClickZoomIcon() {
    if (!this.rootTree) return

    const isZoomIn = this.mode === 'zoomIn'
    // 当前展示的深度
    let currentShowDepth = this.currentShowDepth

    // 放大时，显示的深度 + 1，并且深度不能超过最大深度
    if (isZoomIn) {
      currentShowDepth = Math.min(this.depthMax, currentShowDepth + 1)
    } else {
      // 缩小时，显示的深度 - 1，并且深度不能小于最小深度
      currentShowDepth = Math.max(this.depthMin, currentShowDepth - 1)
    }

    this.rootTree.depthMap.forEach((node, depth) => {
      if (isZoomIn ? depth > currentShowDepth : depth <= currentShowDepth) return

      node.forEach((childNode) => {
        if (!childNode.data) return

        childNode.data.isDisplay = isZoomIn ? true : false
        childNode.data.TitleItem?.requestUpdate()
        childNode.parent?.data?.TitleItem?.requestUpdate()
      })
    })

    this.onClickZoom({ currentShowDepth })
  }

  render() {
    const disabled = this.getDisabled()

    return html` <wc-button
      .disabled=${disabled}
      @click=${() => this.onClickZoomIcon()}
      .iconSize=${this.iconSize}
      .icon=${this.mode}
      iconColor="var(--theme-icon)"
    >
    </wc-button>`
  }
}
