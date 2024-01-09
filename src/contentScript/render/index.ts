import { TitleTree } from '../interface'

import { TitleTreeComponent } from '../components/TitleTree'
import { WCNavigatorPanel } from '../components/NavigatorPanel'
import { WCPage } from './page'

export function renderTree(titleTree: TitleTree, content: Element) {
  const Page = new WCPage({ rootTree: titleTree, content })
  document.body.appendChild(Page)
}
