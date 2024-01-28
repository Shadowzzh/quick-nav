import '@webcomponents/custom-elements'
import { ElapsedTime } from '../utils'
import { extractContent, generatorTitleTree } from './analysis'
import { removeRenderTree, renderTree } from './render'
import { ENV } from '../env'
import './styles/mixins'
import './styles/waves.js'

export const App = (() => {
  let isOpen = false

  /** 构建标题树 */
  const structureTitleTree = () => {
    const content = extractContent()
    if (!content) console.warn('未找到文章内容')

    const TitleTree = content ? generatorTitleTree(content) : null

    if (ENV.isDev) {
      console.log('🚀 ~ structureTitleTree ~ TitleTree:', TitleTree)
      console.log('🚀 ~ structureTitleTree ~ content:', content)
    }

    return [content, TitleTree] as const
  }

  return {
    refresh() {
      if (!isOpen) return { content: null, TitleTree: null }
      const [content, TitleTree] = structureTitleTree()
      return { content, TitleTree }
    },

    /** 打开渲染树 */
    open() {
      if (ENV.isDev) {
        console.clear()
        ElapsedTime.start('open app')
      }

      const [content, TitleTree] = structureTitleTree()

      if (content && TitleTree) {
        renderTree(content, TitleTree)
      }

      ENV.isDev && ElapsedTime.end('open app')
      isOpen = true
    },

    /** 移除渲染树 */
    close() {
      removeRenderTree()
    },

    /** 设置是否打开 */
    setIsOpen(value: boolean) {
      isOpen = value
    },

    /** 是否打开 */
    get isOpen() {
      return isOpen
    },
  }
})()

if (ENV.isDev) {
  App.open()
  import('./index')
}
