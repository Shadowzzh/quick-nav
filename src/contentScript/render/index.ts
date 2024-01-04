import { TitleTree } from '../interface'

import { TitleTreeComponent } from '../components/TitleTree'
import { NavigatorPanel } from '../components/NavigatorPlanel'
import { WCPage } from './page'

export function renderTree(titleTree: TitleTree) {
  const Page = new WCPage({ rootTree: titleTree })
  document.body.appendChild(Page)
}
