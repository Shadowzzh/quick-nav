import type { WCNavigatorPanel } from '../components/NavigatorPanel'
import { LitElement, html, css, PropertyValueMap } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { TitleTree, TitleTreeData } from '../interface'
import { scrollSmoothTo } from '../../utils'
import { TitleTreeComponent } from '../components/TitleTree'
import { getScrollElement } from '../analysis'
import { Ref, createRef, ref } from 'lit/directives/ref.js'
import { Tree } from '../../utils/models/Tree'
import '../components/TitleTree'
import '../components/NavigatorPanel'

interface WCPageOptions {}

/**
 * 页面
 */
@customElement('wc-page')
export class WCPage extends LitElement {
  static styles = [
    css`
      :host {
      }
    `,
  ]

  @property({ type: Object })
  rootTree: TitleTree

  @property({ type: Boolean })
  isAllDisplay: boolean = true

  observerList: IntersectionObserver[] = []

  navigatorPanelRef: Ref<WCNavigatorPanel> = createRef()

  constructor(props: { rootTree: TitleTree; content: Element }) {
    super()
    this.rootTree = props.rootTree
  }

  disconnectedCallback(): void {
    this.observerList.forEach((observer) => {
      observer.disconnect()
    })
  }

  protected firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>,
  ): void {
    this.rootTree?.eachChild((child) => {
      TitleTreeComponent.TreeMap.set(child.uniqueId, child)

      const observerInstance = this.observerNodeElement(child)
      observerInstance && this.observerList.push(observerInstance)
    })
  }

  observerTrigger() {}

  /** 观测每一个 node 的 element */
  observerNodeElement = (function () {
    /** 上一个被触发的 node */
    let preNode: Tree<TitleTreeData> | undefined = undefined

    return function (this: WCPage, node: Tree<TitleTreeData>) {
      const element = node.data?.element

      if (!element) return

      const observer = new IntersectionObserver(
        (entries) => {
          const titleItemOffset = {
            top: node.data?.TitleItem?.offsetTop ?? 0,
            height: node.data?.TitleItem?.offsetHeight ?? 0,
          }
          const firstEntries = entries[0]

          // 跳过从下面进入视图中的元素
          if (firstEntries.boundingClientRect.top >= firstEntries.boundingClientRect.height) return

          const data = node.data!

          // 清空上个node的状态
          if (preNode) {
            preNode.data!.isActive = false
            preNode.data!.TitleItem?.requestUpdate()
          }

          const scrollInstance = this.navigatorPanelRef.value?.getScrollInstance()
          if (scrollInstance && scrollInstance.ps && data.TitleItem) {
            const isViewTop =
              titleItemOffset.top + titleItemOffset.height >= scrollInstance.ps.element.scrollTop
            if (isViewTop === false) {
              scrollInstance.ps.element.scrollTop = titleItemOffset.top
            }

            const isViewBottom =
              scrollInstance.ps.element.scrollTop + scrollInstance.ps.element.offsetHeight >=
              titleItemOffset.top + titleItemOffset.height
            if (isViewBottom === false) {
              scrollInstance.ps.element.scrollTop =
                titleItemOffset.top +
                titleItemOffset.height -
                scrollInstance.ps.element.offsetHeight
            }
          }

          data.isActive = true
          data.TitleItem?.requestUpdate()

          preNode = node
        },
        {
          threshold: [0, 1],
        },
      )

      // 开始观察
      observer.observe(element)

      return observer
    }
  })()

  /** 全部 展开/闭合 */
  onToggleAllDisplay() {
    this.isAllDisplay = !this.isAllDisplay

    this.rootTree.children.forEach((tree) => {
      tree.eachChild((node) => {
        if (!node.data) return
        node.data.isDisplay = this.isAllDisplay
        node.data.TitleItem?.requestUpdate()
      })
      if (!tree.data) return
      tree.data.TitleItem?.requestUpdate()
    })

    // TODO FIX item 过多可能导致在下下一帧才会完成所有的更新，从而导致此次scrollUpdate调用过早。
    /** 所有 item 闭合后，导致 scroll 变化，需要主动调用更新 */
    requestAnimationFrame(() => {
      this.navigatorPanelRef.value?.scrollUpdate()
    })
  }

  /** 全部展开 Icon */
  allExpandIcon() {
    const iconName = this.isAllDisplay ? 'allCollapse' : 'allExpand'

    return html` <wc-button class="header_allCollapse" @click=${() => this.onToggleAllDisplay()}>
      <wc-icon class="header_icon" name=${iconName} size="16" color="#999"></wc-icon>
    </wc-button>`
  }

  /** 点击树的 item */
  onClickTreeItem(params: Parameters<Exclude<TitleTreeComponent['onClickItem'], undefined>>[0]) {
    const container = getScrollElement(params.target)
    scrollSmoothTo({ target: params.target, container })
  }

  /** 点击树的 item icon */
  onclickTreeItemIcon() {
    requestAnimationFrame(() => {
      this.navigatorPanelRef.value?.scrollUpdate()
    })
  }

  render() {
    if (this.rootTree === null) return

    return html`<div>
      <wc-navigator-panel ref=${ref(this.navigatorPanelRef)} .extraIcon=${[this.allExpandIcon()]}>
        <title-tree
          .rootTree=${this.rootTree}
          .onClickItem=${this.onClickTreeItem}
          .onClickItemIcon=${() => this.onclickTreeItemIcon()}
        >
        </title-tree>
      </wc-navigator-panel>
    </div>`
  }
}
