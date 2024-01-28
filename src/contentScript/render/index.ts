import { DEFAULT_CONFIG } from '../../defaultConfig'
import { syncStorage } from '../../utils/storage'
import { QN, TitleTree } from '../interface'
import { WCPage } from './page'
import { App } from '../launch'
import { observerNode } from './utils'

/** page页面 */
let Page: WCPage | undefined = undefined

const animateOption = [
  { opacity: 0, transform: 'scale(0.8)' },
  { opacity: 1, transform: 'scale(1)' },
]

// 动画时长
const animateDuration = 1000

// const navigatorPanelAnimate = new EhAnimate({
//   keyframes: animateOption,
//   options: {
//     duration: animateDuration,
//     // easing: animationEaseOutQuart,
//     easing: 'ease',
//   },
// })

/** 渲染树 */
export async function renderTree(content: HTMLElement, titleTree: TitleTree) {
  const theme: QN.Theme = (await syncStorage.get('theme')) ?? 'dark'

  // 如果已经存在渲染树，则不再创建
  if (!Page) {
    Page = new WCPage({ rootTree: titleTree, content })
    Page.setAttribute(`data-${DEFAULT_CONFIG.THEME_NAME}`, theme)
    document.body.appendChild(Page)
  }
}

/** 移除渲染树 */
export const removeRenderTree = async () => {
  App.setIsOpen(false)
  observerNode.disconnect()

  if (App.isOpen === false && Page) {
    Page.remove()
    Page = undefined
  }
}
