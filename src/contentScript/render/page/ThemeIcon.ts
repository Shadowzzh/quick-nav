import { LitElement, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'

import type { QN } from '@/contentScript/interface'

import { DEFAULT_CONFIG } from '@/defaultConfig'
import { APP_THEME } from '@/contentScript/constant'
import { syncStorage } from '@/utils/storage'

@customElement('wc-page-theme-icon')
export class WCPageThemeIcon extends LitElement {
  /** 图标大小 */
  @property({ type: Number })
  private iconSize = 16

  /** 页面实例 */
  private pageInstance: LitElement | undefined

  /** 主题暗色｜亮色 */
  @state()
  private theme: QN.Theme = 'light'

  /** 初次加载 */
  protected firstUpdated() {
    // 从属性中获取主题
    this.theme = this.pageInstance?.getAttribute(`data-${DEFAULT_CONFIG.THEME_NAME}`) as QN.Theme
  }

  /** 切换主题 */
  private async onToggleTheme() {
    this.theme = this.theme === APP_THEME.LIGHT ? 'dark' : 'light'

    await syncStorage.set(['theme'], this.theme)
    this.pageInstance?.setAttribute(`data-${DEFAULT_CONFIG.THEME_NAME}`, this.theme)
  }

  render() {
    const iconName = this.theme === APP_THEME.LIGHT ? 'moonLight' : 'sunLight'

    return html` <wc-button @click=${() => this.onToggleTheme()}>
      <wc-icon
        class="header_icon"
        name=${iconName}
        size=${this.iconSize}
        color="var(--theme-icon)"
      ></wc-icon>
    </wc-button>`
  }
}
