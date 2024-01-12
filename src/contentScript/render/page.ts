import type { WCNavigatorPanel } from '../components/NavigatorPanel'
import { LitElement, html, css, PropertyValueMap } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { QN, TitleTreeData } from '../interface'
import { scrollSmoothTo } from '../../utils'
import { TitleTreeComponent } from '../components/TitleTree'
import { getScrollElement } from '../analysis'
import { Ref, createRef, ref } from 'lit/directives/ref.js'
import { Tree } from '../../utils/models/Tree'
import '../components/TitleTree'
import '../components/NavigatorPanel'
import { DEFAULT_CONFIG } from '../../defaultConfig'
import { syncStorage } from '../../utils/storage'

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
  rootTree: Tree<TitleTreeData>

  /** 是否全部展开 */
  @property({ type: Boolean })
  isAllDisplay: boolean = true

  /** 主题 */
  @property({ type: String })
  theme: QN.Theme = 'light'

  observerList: IntersectionObserver[] = []

  navigatorPanelRef: Ref<WCNavigatorPanel> = createRef()

  constructor(props: { rootTree: Tree<TitleTreeData>; content: Element }) {
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
    this.theme = this.getAttribute(`data-${DEFAULT_CONFIG.THEME_NAME}`) as QN.Theme

    this.rootTree?.eachChild((child) => {
      TitleTreeComponent.TreeMap.set(child.uniqueId, child)

      const observerInstance = this.observerNodeElement(child)
      observerInstance && this.observerList.push(observerInstance)
    })
  }

  observerTrigger() {}

  // TODO 使用 scroll 代替 IntersectionObserver 实现
  /** 观测每一个 node 的 element */
  observerNodeElement = (function () {
    /** 上一个被触发的 node */
    let preNode: Tree<TitleTreeData> | undefined = undefined

    return function (this: WCPage, node: Tree<TitleTreeData>) {
      const element = node.data?.element
      if (!element) return

      const observer = new IntersectionObserver(
        (entries) => {
          const firstEntries = entries[0]

          // 跳过从下面进入视图中的元素
          if (firstEntries.boundingClientRect.top >= firstEntries.boundingClientRect.height) return

          const data = node.data!

          // 清空上个node的状态
          if (preNode) {
            preNode.data!.isActive = false
            this.observerToggleAncestorActive(preNode, false)
            preNode.data!.TitleItem?.requestUpdate()
          }

          this.observerToggleAncestorActive(node, true)
          this.observerKeepViewInfo(node)

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

  /** 控制 scroll 滚动，使选中的 item 保存在视图中 */
  observerKeepViewInfo(node: Tree<TitleTreeData>) {
    const titleItemOffset = {
      top: node.data?.TitleItem?.offsetTop ?? 0,
      height: node.data?.TitleItem?.offsetHeight ?? 0,
    }
    const data = node.data!
    /** childActive 为 true 的 childActive 数量 */
    const childActiveTreeCount = TitleTreeComponent.childActiveTree.size
    /** childActive 的总高度 */
    const childActiveTreeHeight = childActiveTreeCount * titleItemOffset.height

    // TODO 逻辑优化
    const scrollInstance = this.navigatorPanelRef.value?.getScrollInstance()
    if (scrollInstance && scrollInstance.ps && data.TitleItem) {
      const isViewTop =
        titleItemOffset.top - childActiveTreeHeight >= scrollInstance.ps.element.scrollTop
      if (isViewTop === false) {
        scrollSmoothTo({
          container: scrollInstance.ps.element,
          target: titleItemOffset.top - childActiveTreeHeight,
        })
      }

      const isViewBottom =
        scrollInstance.ps.element.scrollTop + scrollInstance.ps.element.offsetHeight >=
        titleItemOffset.top + titleItemOffset.height
      if (isViewBottom === false) {
        scrollSmoothTo({
          container: scrollInstance.ps.element,
          target:
            titleItemOffset.top + titleItemOffset.height - scrollInstance.ps.element.offsetHeight,
        })
      }
    }
  }

  /** 使选中的 item 的祖先 DOM 变为 Active 状态。 */
  observerToggleAncestorActive(node: Tree<TitleTreeData>, isOpen: boolean) {
    node.eachAncestor((ancestor) => {
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

  /** 切换主题 */
  async onToggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light'
    await syncStorage.set(['theme'], this.theme)
    this.setAttribute(`data-${DEFAULT_CONFIG.THEME_NAME}`, this.theme)
  }

  /** 全部展开 Icon */
  allExpandIcon() {
    const iconName = this.isAllDisplay ? 'allCollapse' : 'allExpand'

    return html` <wc-button class="header_allCollapse" @click=${() => this.onToggleAllDisplay()}>
      <wc-icon class="header_icon" name=${iconName} size="16" color="var(--theme-icon)"></wc-icon>
    </wc-button>`
  }

  /** 主题 Icon */
  themeIcon() {
    const iconName = this.theme === 'light' ? 'moonLight' : 'sunLight'

    return html` <wc-button @click=${() => this.onToggleTheme()}>
      <wc-icon class="header_icon" name=${iconName} size="16" color="var(--theme-icon)"></wc-icon>
    </wc-button>`
  }

  /** 放大 Icon */
  zoomInIcon() {
    return html` <wc-button>
      <wc-icon class="header_icon" name="zoomIn" size="16" color="var(--theme-icon)"></wc-icon>
    </wc-button>`
  }

  /** 缩小 Icon */
  zoomOutIcon() {
    return html` <wc-button>
      <wc-icon class="header_icon" name="zoomOut" size="16" color="var(--theme-icon)"></wc-icon>
    </wc-button>`
  }

  /** 搜索 Icon */
  searcherIcon() {
    return html` <wc-button>
      <wc-icon class="header_icon" name="searcher" size="16" color="var(--theme-icon)"></wc-icon>
    </wc-button>`
  }

  moreIcon() {
    return html` <wc-button>
      <wc-icon class="header_icon" name="more" size="16" color="var(--theme-icon)"></wc-icon>
    </wc-button>`
  }

  refreshIcon() {
    return html` <wc-button>
      <wc-icon class="header_icon" name="refresh" size="16" color="var(--theme-icon)"></wc-icon>
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
      <wc-navigator-panel
        ref=${ref(this.navigatorPanelRef)}
        .extraIcon=${[
          // this.searcherIcon(),
          // this.zoomInIcon(),
          // this.zoomOutIcon(),
          this.themeIcon(),
          this.allExpandIcon(),
          // this.refreshIcon(),
          // this.moreIcon(),
        ]}
      >
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
