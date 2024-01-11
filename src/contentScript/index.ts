import { asyncDebounce } from '../utils'
import { extractContent, generatorTitleTree } from './analysis'
import { renderTree } from './render'
import './styles/mixins'
import './styles/waves.js'

console.time()

const generator = () => {
  const content = extractContent()
  if (!content) {
    console.log('未找到文章内容')
    return
  }

  const TitleTree = generatorTitleTree(content)
  if (!TitleTree) return

  return { TitleTree, content }
}

;(() => {
  /**
   * 监听页面高度变化，重新生成标题树。
   * 因为页面高度变化可能是因为文章内容增加了，所以需要重新生成标题树 */
  const resizeObserver = new ResizeObserver(
    asyncDebounce<ResizeObserverCallback>((entries) => {
      entries.forEach((entry) => {
        const { TitleTree, content } = generator() ?? {}
        if (!TitleTree || !content) return
        renderTree(TitleTree, content)
      })
    }, 500),
  )

  const { TitleTree, content } = generator() ?? {}
  if (!TitleTree || !content) return

  resizeObserver.observe(content)
})()
console.timeEnd()
