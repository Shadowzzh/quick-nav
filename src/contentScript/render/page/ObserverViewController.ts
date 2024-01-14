import { ReactiveController, ReactiveControllerHost } from 'lit'
import {
  getOffsetTopElement,
  getScrollElement,
  getScrollTopElement,
} from '@/contentScript/analysis'
import { TitleTreeComponent } from '@/contentScript/components/TitleTree'
import { TitleTreeData } from '@/contentScript/interface'
import { asyncThrottle } from '@/utils'
import { Tree } from '@/utils/models'

export type Anchor = { node: Tree<TitleTreeData>; top: number }

/** 观察视图 */
export class ObserverViewController implements ReactiveController {
  host: ReactiveControllerHost

  /** 标题树 */
  tree: Tree<TitleTreeData> | undefined

  /** 容器 */
  container: HTMLElement | Window | undefined

  /** 锚点 */
  anchors: Anchor[] = []

  _onScroll: EventListener | undefined

  /** 滚动到视图中 - 触发 */
  onInView: (params: { anchor: Anchor }) => void = () => {}

  constructor(host: ReactiveControllerHost) {
    ;(this.host = host).addController(this)
    this._onScroll = asyncThrottle(this.onScroll.bind(this), 50)
  }

  hostConnected() {}

  hostDisconnected() {
    this._onScroll && this.container?.removeEventListener('scroll', this._onScroll)
  }

  /** 设置信息 */
  setInfo(params: {
    tree: Tree<TitleTreeData>
    container: HTMLElement
    onInView: ObserverViewController['onInView']
  }) {
    this.onInView = params.onInView
    this.tree = params.tree
    this.container = getScrollElement(params.container)

    this.initialize()

    if (!this._onScroll) return

    const $html = document.querySelector('html')
    const scrollContainer = this.container === $html ? window : this.container
    scrollContainer.addEventListener('scroll', this._onScroll)
  }

  /** 初始化锚点 */
  private initialize() {
    this.anchors = []
    if (!this.tree) return

    this.tree.eachChild((node) => {
      if (!node.data?.element) return

      const element = node.data.element
      const top = getOffsetTopElement(element)

      this.anchors.push({ node, top })
    })

    // TODO 动画问题
    // 防止 scroll 组件比 page 组件先加载完成后导致动画失败
    setTimeout(() => {
      requestAnimationFrame(() => {
        this.searcherAnchorInView()
      })
    }, 100)
  }

  /** 滚动时触发 */
  private onScroll() {
    this.searcherAnchorInView()
  }

  /** 搜索当前视图中的锚点 */
  private searcherAnchorInView() {
    if (!this.container) return

    const targetAnchor = this.searchAnchor(this.anchors, getScrollTopElement(this.container))

    if (targetAnchor) {
      this.inViewActive(targetAnchor)
      this.onInView({ anchor: targetAnchor })
    }
  }

  /** 使选中的 item 的祖先 DOM 变为 Active 状态。 */
  private inViewActiveAncestor(anchor: Anchor, isOpen: boolean) {
    anchor.node.eachAncestor((ancestor) => {
      if (!ancestor.data?.TitleItem) return

      if (isOpen) {
        ancestor.data.childActive = true
        TitleTreeComponent.childActiveTree.add(ancestor)
      } else {
        ancestor.data.childActive = false
        TitleTreeComponent.childActiveTree.delete(ancestor)
      }
      ancestor.data.TitleItem.requestUpdate()
    })
  }

  /** 在视图中出现 */
  private inViewActive = (function () {
    /** 上一个被触发的 node */
    let preAnchor: Anchor | undefined = undefined

    return function (this: ObserverViewController, anchor: Anchor) {
      if (!anchor.node.data) return

      // 清空上个node的状态
      if (preAnchor) {
        this.inViewActiveAncestor(preAnchor, false)
        preAnchor.node.data!.isActive = false
        preAnchor.node.data!.TitleItem?.requestUpdate()
      }

      this.inViewActiveAncestor(anchor, true)

      anchor.node.data.isActive = true
      anchor.node.data.TitleItem?.requestUpdate()

      preAnchor = anchor
    }
  })()

  /** 搜索锚点 */
  private searchAnchor(anchors: Anchor[], target: number) {
    let left = 0
    let right = anchors.length - 1

    while (left <= right) {
      const middle = Math.floor((left + right) / 2)
      const anchor = anchors[middle]

      if (anchor.top < target) {
        left = middle + 1
      } else if (anchor.top > target) {
        right = middle - 1
      } else {
        return anchor
      }
    }

    return right === -1 ? anchors[0] : anchors[right]
  }
}
