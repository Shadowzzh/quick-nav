import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import type { TitleTreeData } from '@/contentScript/interface'
import type { Tree } from '@/utils/models'

import { extractContent, generatorTitleTree } from '@/contentScript/analysis'
import { App } from '@/contentScript/launch'

@customElement('wc-page-refresh-icon')
export class WCPageRefreshIcon extends LitElement {
  /** 图标大小 */
  @property({ type: Number })
  private iconSize = 16

  /** 根节点 */
  @property({ type: Object })
  rootTree: Tree<TitleTreeData> | undefined = undefined

  /** 点击刷新时 - 触发 */
  onClickRefresh: (params: { TitleTree: Tree<TitleTreeData> }) => void = () => {}

  /** 刷新 */
  onRefresh() {
    const { TitleTree } = App.refresh()
    TitleTree && this.onClickRefresh({ TitleTree })
  }

  render() {
    return html` <wc-button
      @click=${() => this.onRefresh()}
      .iconSize=${this.iconSize}
      icon="refresh"
      iconColor="var(--theme-icon)"
    >
    </wc-button>`
  }
}
