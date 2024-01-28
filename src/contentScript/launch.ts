import '@webcomponents/custom-elements'
import { ElapsedTime, asserts, asyncDebounce } from '../utils'
import {
  eachHTMLElement,
  extractContent,
  generatorTitleTree,
  getScrollElement,
  hasArticleTag,
} from './analysis'
import { removeRenderTree, renderTree } from './render'
import { ENV } from '../env'
import './styles/mixins'
import './styles/waves.js'
import { TitleTreeComponent } from './components/TitleTree'

export const App = (() => {
  let isOpen = false

  return {
    refresh() {
      if (!isOpen) return

      const content = extractContent()
      ENV.isDev && console.log('content', content)
      if (!content) return console.warn('未找到文章内容')

      const TitleTree = generatorTitleTree(content)
      ENV.isDev && console.log('TitleTree', TitleTree)
      if (!TitleTree) return

      return TitleTree
    },

    /** 打开渲染树 */
    open() {
      if (ENV.isDev) {
        console.clear()
        ElapsedTime.start('open app')
      }

      const runRender = () => {
        const content = extractContent()
        ENV.isDev && console.log('content', content)
        if (!content) return console.error('未找到文章内容')

        /** run render tree */
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

export const observerNode = (function () {
  let mo: MutationObserver | null = null

  const listener = (props: {
    target: HTMLElement
    delay?: number
    onAddNode?: (elementList: HTMLElement[]) => void
  }) => {
    const { delay = 1000, target, onAddNode } = props

    /**  */
    const addNodeCallback = (() => {
      const addNodeTask: Node[] = []
      let timer: number | undefined = undefined

      return (addedNodes: NodeList) => {
        addNodeTask.push(...Array.from(addedNodes))
        if (timer) clearTimeout(timer)

        const task = () => {
          const accordAddNodes = addNodeTask.filter((node) => {
            if (asserts.isHTMLElement(node) === true && hasArticleTag(node, true) === true) {
              return true
            }
          })

          accordAddNodes.length > 0 && onAddNode?.(accordAddNodes as HTMLElement[])
          timer = undefined
          console.log('🚀 ~ task ~ addNodeTask', addNodeTask)
          addNodeTask.length = 0
        }

        timer = setTimeout(task, delay) as unknown as number
      }
    })()

    const callback: MutationCallback = function (records) {
      records.forEach(({ addedNodes, removedNodes }) => {
        addNodeCallback(addedNodes)

        // 如果删除的HTMLElement中有文章标签，则隐藏该 TitleItem
        Array.from(removedNodes).some((node) => {
          if (asserts.isHTMLElement(node) === false) return
          eachHTMLElement(node, (element) => {
            const targetNode = TitleTreeComponent.elementMap.get(element)
            if (!targetNode?.data) return

            targetNode.data.isDestroyed = true
            targetNode.data.TitleItem?.requestUpdate()
          })
          return
        })
      })
    }

    mo = new MutationObserver(callback)

    const option = {
      childList: true,
      subtree: true,
    }

    mo.observe(target, option)
  }

  const disconnect = () => {
    mo?.disconnect()
  }

  return { listener, disconnect }
})()

if (ENV.isDev) {
  App.open()
  import('./index')
}
