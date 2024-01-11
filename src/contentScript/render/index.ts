import { DEFAULT_CONFIG } from '../../defaultConfig'
import { syncStorage } from '../../utils/storage'
import { QN, TitleTree } from '../interface'
import { WCPage } from './page'

export async function renderTree(titleTree: TitleTree, content: HTMLElement) {
  const $page = document.querySelector('wc-page')
  $page && document.body.removeChild($page)
  const Page = new WCPage({ rootTree: titleTree, content })

  const theme: QN.Theme = (await syncStorage.get('theme')) ?? 'light'

  Page.setAttribute(`data-${DEFAULT_CONFIG.THEME_NAME}`, theme)
  document.body.appendChild(Page)
}
