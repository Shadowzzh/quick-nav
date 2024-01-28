import { DEFAULT_CONFIG } from '../../defaultConfig'
import { syncStorage } from '../../utils/storage'
import { QN, TitleTree } from '../interface'
import { WCPage } from './page'
import { App, observerNode } from '../launch'

/** page页面 */
let Page: WCPage | undefined = undefined

// TODO 递归获取 shadowRoot 中的 Dom
/** 获取 Page 中的 NavigatorPanel */
function getNavigatorPanel() {
  if (!Page) return

  const shadowRoot = Page.shadowRoot
  const navigatorPanel = shadowRoot
    ?.querySelector('wc-navigator-panel')
    ?.shadowRoot?.querySelector('.quick-nav') as HTMLElement

  return navigatorPanel
}

/** 渲染树 */
export async function renderTree(content: HTMLElement, titleTree?: TitleTree) {
  if (!titleTree || Page) return

  const theme: QN.Theme = (await syncStorage.get('theme')) ?? 'dark'

  Page = new WCPage({ rootTree: titleTree, content })
  Page.setAttribute(`data-${DEFAULT_CONFIG.THEME_NAME}`, theme)

  document.body.appendChild(Page)
}

/** 移除渲染树 */
export const removeRenderTree = (() => {
  let timer: number | undefined = undefined

  return function () {
    App.isOpen && clearTimeout(timer)
    App.setIsOpen(false)
    observerNode.disconnect()
    if (!Page) return

    const navigatorPanel = getNavigatorPanel()
    if (!navigatorPanel) return

    // navigatorPanel.style.transition = `
    //   opacity 0.25s var(--animation-ease-out-circ),
    //   transform 0.25s var(--animation-ease-out-circ)`
    // navigatorPanel.style.transformOrigin = 'top right'
    // navigatorPanel.style.opacity = '0'
    // navigatorPanel.style.transform = 'scale(0.5)'

    // timer = setTimeout(() => {
    Page?.remove()
    // }, 300) as unknown as number

    Page = undefined
  }
})()
