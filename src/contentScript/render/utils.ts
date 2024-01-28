import { asserts } from '@/utils'
import { eachHTMLElement, hasArticleTag } from '../analysis'
import { TitleTreeComponent } from '../components/TitleTree'

interface ObserverNodeListenerProps {
  /** 监听的目标 */
  target: HTMLElement
  /** 延迟时间 */
  delay?: number
  /** 添加节点回调 */
  onAddNode?: (elementList: HTMLElement[]) => void
  /** 删除节点回调 */
  onRemoveNode?: (elementList: HTMLElement[]) => void
}

/** 监听 Node 变化 */
export const observerNode = (function () {
  let mo: MutationObserver | null = null

  const option = {
    childList: true,
    subtree: true,
  }

  const listener = (props: ObserverNodeListenerProps) => {
    const { delay = 1000, target, onAddNode, onRemoveNode } = props

    // 增加 Nodes 时的回调
    const addNodeCallback = (() => {
      // 缓存的节点
      const addNodeTask: Node[] = []
      let timer: number | undefined = undefined

      return (addedNodes: NodeList) => {
        // 保存 delay 时间内增加的节点，然后 delay 后统一处理。
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
          addNodeTask.length = 0
        }

        timer = setTimeout(task, delay) as unknown as number
      }
    })()

    // 删除 Nodes 时的回调
    const removeNodeCallback = (removedNodes: NodeList) => {
      onRemoveNode?.(Array.from(removedNodes) as HTMLElement[])
    }

    // MutationObserver 的回调
    const mutationObserverCallback: MutationCallback = function (records) {
      records.forEach(({ addedNodes, removedNodes }) => {
        addNodeCallback(addedNodes)
        removeNodeCallback(removedNodes)
      })
    }

    mo = new MutationObserver(mutationObserverCallback)
    mo.observe(target, option)
  }

  const disconnect = () => {
    mo?.disconnect()
  }

  return {
    /** 监听节点变化 */
    listener,
    /** 断开监听 */
    disconnect,
  }
})()
