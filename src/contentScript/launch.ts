import '@webcomponents/custom-elements'
import { ElapsedTime } from '../utils'
import { extractContent, generatorTitleTree } from './analysis'
import { removeRenderTree, renderTree } from './render'
import { ENV } from '../env'
import './styles/mixins'
import './styles/waves.js'

export const App = (() => {
  let isOpen = false

  return {
    /** 打开渲染树 */
    open() {
      if (ENV.isDev) {
        console.clear()
        ElapsedTime.start('open app')
      }
      const content = extractContent()
      ENV.isDev && console.log('content', content)
      if (!content) return console.error('未找到文章内容')

      /** run render tree */
      const runRender = () => {
        const TitleTree = generatorTitleTree(content)
        ENV.isDev && console.log('TitleTree', TitleTree)
        renderTree(content, TitleTree)

        ENV.isDev && ElapsedTime.end('open app')
        isOpen = true
      }

      runRender()
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
