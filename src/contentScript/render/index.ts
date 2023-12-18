import { TitleTree } from '../interface'


import { TitleTreeComponent } from '../components/TitleTree'
import { NavigatorPanel } from '../components/NavigatorPlanel'

export function renderTree(titleTree: TitleTree) {
  const navigatorPanel = new NavigatorPanel()
  navigatorPanel.appendChild(new TitleTreeComponent({ treeData: titleTree }))
  document.body.appendChild(navigatorPanel)
}
