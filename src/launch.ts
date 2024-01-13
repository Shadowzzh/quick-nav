import '@webcomponents/custom-elements'
import { ElapsedTime, asyncDebounce } from './utils'
import { extractContent, generatorTitleTree } from './contentScript/analysis'
import { removeRenderTree, renderTree } from './contentScript/render'
import { ENV } from './env'
import './contentScript/styles/mixins'
import './contentScript/styles/waves.js'

export const App = (() => {
  let isOpen = false
  let resizeObserver: ResizeObserver | undefined = undefined

  return {
    /** 打开渲染树 */
    open() {
      console.clear()
      ENV.isDev && ElapsedTime.start('open app')
      const content = extractContent()
      if (!content) return console.error('未找到文章内容')

      /** run render tree */
      const runRender = () => {
        const TitleTree = generatorTitleTree(content)
        renderTree(content, TitleTree)

        ENV.isDev && ElapsedTime.end('open app')
        ENV.isPro &&
          console.log(`🚀 ~ open ~ quick nav, my home link : https://github.com/Shadowzzh`)

        isOpen = true
      }

      const debounceRunRender = asyncDebounce(runRender, 500, true)
      debounceRunRender()

      /**
       * 监听页面高度变化，重新生成标题树。
       * 因为页面高度变化可能是因为文章内容增加了，所以需要重新生成标题树 */
      // resizeObserver = new ResizeObserver(debounceRunRender)
      // resizeObserver.observe(content)
    },

    /** 移除渲染树 */
    close() {
      isOpen = false
      resizeObserver?.disconnect()
      removeRenderTree()
    },

    /** 是否打开 */
    get isOpen() {
      return isOpen
    },
  }
})()
