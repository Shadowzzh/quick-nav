import { TitleTree } from '../interface'

import { TitleTreeComponent } from '../components/TitleTree'
import { NavigatorPanel } from '../components/NavigatorPlanel'
import { WCPage } from './page'

export function renderTree(titleTree: TitleTree, content: Element) {
  const Page = new WCPage({ rootTree: titleTree, content })
  document.body.appendChild(Page)
}
