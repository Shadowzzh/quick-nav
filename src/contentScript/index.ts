import { extractContent, generatorTitleTree } from './analysis'
import { renderTree } from './render'

console.time()
;(() => {
  const content = extractContent()
  if (!content) {
    console.log('未找到文章内容')
    return
  }

  const TitleTree = generatorTitleTree(content)
  if (!TitleTree) return

  renderTree(TitleTree)
})()
console.timeEnd()
