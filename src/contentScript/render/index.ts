import { TitleTree } from '../interface'
import { WCPage } from './page'


export function renderTree(titleTree: TitleTree, content: HTMLElement) {
  const Page = new WCPage({ rootTree: titleTree, content })
  document.body.appendChild(Page)
}
