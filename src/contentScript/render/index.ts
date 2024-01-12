import { DEFAULT_CONFIG } from '../../defaultConfig'
import { syncStorage } from '../../utils/storage'
import { QN, TitleTree } from '../interface'
import { WCPage } from './page'

export async function renderTree(content: HTMLElement, titleTree?: TitleTree) {
  if (!titleTree) return

  removeRenderTree()
  const Page = new WCPage({ rootTree: titleTree, content })

  const theme: QN.Theme = (await syncStorage.get('theme')) ?? 'light'

  Page.setAttribute(`data-${DEFAULT_CONFIG.THEME_NAME}`, theme)
  document.body.appendChild(Page)
}

/** 移除渲染树 */
export function removeRenderTree() {
  const $page = document.querySelector('wc-page')
  $page && document.body.removeChild($page)
}
