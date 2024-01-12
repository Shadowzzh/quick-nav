import { asyncDebounce } from '../utils'
import { extractContent, generatorTitleTree } from './analysis'
import { PLATFORM_MESSAGE_TYPE } from './constant'
import { PlatformMessage } from './interface'
import { removeRenderTree, renderTree } from './render'
import './styles/mixins'
import './styles/waves.js'

const App = (() => {
  let isOpen = false
  let resizeObserver: ResizeObserver | undefined = undefined

  return {
    /** 打开渲染树 */
    open() {
      const content = extractContent()
      if (!content) return console.error('未找到文章内容')

      /** run render tree */
      const runRender = () => {
        const TitleTree = generatorTitleTree(content)
        renderTree(content, TitleTree)

        console.timeEnd('open app')
        console.log(`🚀 ~ open ~ quick nav, my home link : https://github.com/Shadowzzh`)

        isOpen = true
      }

      const debounceRunRender = asyncDebounce(runRender, 500, true)

      // 立即执行一次
      debounceRunRender()
      /**
       * 监听页面高度变化，重新生成标题树。
       * 因为页面高度变化可能是因为文章内容增加了，所以需要重新生成标题树 */
      resizeObserver = new ResizeObserver(debounceRunRender)
      resizeObserver.observe(content)
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

chrome.runtime.onMessage.addListener((data: PlatformMessage.Data) => {
  const { type } = data
  switch (type) {
    case PLATFORM_MESSAGE_TYPE.OPEN_QN:
      console.time('open app')
      if (App.isOpen === true) {
        App.close()
      } else {
        App.open()
      }
      break
    case PLATFORM_MESSAGE_TYPE.CLOSE_QN:
      App.close()
      break
  }
})
