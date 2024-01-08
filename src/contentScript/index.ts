import { extractContent, generatorTitleTree } from './analysis'
import { renderTree } from './render'
import './styles/mixins'
import './styles/waves.js'

console.time()
;(() => {
  const content = extractContent()
  if (!content) {
    console.log('未找到文章内容')
    return
  }

  const TitleTree = generatorTitleTree(content)
  console.log(content, TitleTree)
  if (!TitleTree) return

  renderTree(TitleTree)
})()
console.timeEnd()
