import { LitElement, PropertyValueMap, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { Ref, createRef, ref } from 'lit/directives/ref.js'

import type { WCNavigatorPanel } from '../../components/NavigatorPanel'
import type { TitleTreeData } from '../../interface'

import '../../components/TitleTree'
import '../../components/NavigatorPanel'
import './ThemeIcon'
import { TitleTreeComponent } from '../../components/TitleTree'

import { Tree } from '@/utils/models'
import { scrollSmoothTo } from '@/utils'

import { extractContent, generatorTitleTree, getScrollElement } from '../../analysis'

/**
 * 页面
 */
@customElement('wc-page')
export class WCPage extends LitElement {
  static styles = css`
    /* :host {
    } */
    :host .extra_icon {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `

  /** 根节点 */
  @property({ type: Object })
  rootTree: Tree<TitleTreeData>

  /** 是否全部展开 */
  @property({ type: Boolean })
  isAllDisplay: boolean = true

  /** 当前展示的深度 */
  @property({ type: Number })
  currentShowDepth: number = 0

  /** 最大的深度 */
  depthMax: number

  /** 最小的深度 */
  depthMin: number = 1

  /** 额外的 Icon 大小 */
  extraIconSize = 16

  /** 所有观察者列表 */
  observerList: IntersectionObserver[] = []

  /** 导航面板 Ref */
  navigatorPanelRef: Ref<WCNavigatorPanel> = createRef()

  constructor(props: { rootTree: Tree<TitleTreeData>; content: Element }) {
    super()
    this.rootTree = props.rootTree
    this.depthMax = this.rootTree.getMaxDepth()
    // 根节点只有一个字节点时，最小深度为 2，否则为 1
    this.depthMin = this.rootTree.children.length === 1 ? 2 : 1
    this.currentShowDepth = this.depthMax
  }

  disconnectedCallback(): void {
    // 移除所有观察者
    this.observerList.forEach((observer) => {
      observer.disconnect()
    })
  }

  /** 第一次更新 */
  protected updated(propertyValueMap: PropertyValueMap<WCPage>) {
    if (propertyValueMap.has('rootTree')) {
      this.observerList.forEach((observer) => observer.disconnect())
      this.observerList = []

      TitleTreeComponent.TreeMap.clear()
      TitleTreeComponent.childActiveTree.clear()

      this.rootTree?.eachChild((child) => {
        // 将所有的节点存入 map 中
        TitleTreeComponent.TreeMap.set(child.uniqueId, child)

        // 观察每一个节点
        const observerInstance = this.observerNodeElement(child)
        observerInstance && this.observerList.push(observerInstance)
      })
    }
  }

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

  /** 全部的 item 展开｜闭合 */
  onToggleAllDisplay() {
    const isAllDisplay = !this.isAllDisplay
    // 根节点只有一个字节点时
    const isOneChild = this.rootTree.children.length === 1
    // 根节点只有一个字节点时，遍历子节点的子节点
    const baseTree = isOneChild ? this.rootTree.children[0].children : this.rootTree.children
    // 全部展开时，展示最大深度，否则展示 1
    this.currentShowDepth = isAllDisplay ? this.depthMax : this.depthMin

    baseTree.forEach((tree) => {
      // 根节点不参与
      tree.eachChild((node) => {
        if (!node.data) return

        node.data.isDisplay = isAllDisplay
        node.data.TitleItem?.requestUpdate()
      })
    })

    /** 主动更新面板滚动轴的高度，
     *  所有 item 闭合后，导致 scroll 变化，需要主动调用更新 */
    requestAnimationFrame(() => {
      this.navigatorPanelRef.value?.scrollUpdate()
    })

    this.isAllDisplay = isAllDisplay
  }

  /** 全部展开 Icon */
  allExpandIcon({ disabled }: { disabled: boolean }) {
    const iconName =
      this.isAllDisplay && this.currentShowDepth === this.depthMax ? 'allCollapse' : 'allExpand'

    return html` <wc-button
      class="header_allCollapse"
      @click=${() => this.onToggleAllDisplay()}
      .disabled=${disabled}
    >
      <wc-icon
        class="header_icon"
        name=${iconName}
        size=${this.extraIconSize}
        color="var(--theme-icon)"
      ></wc-icon>
    </wc-button>`
  }

  /** 放大缩小 */
  onClickZooIcon(method: 'zoomIn' | 'zoomOut') {
    const isZoomIn = method === 'zoomIn'
    // 当前展示的深度
    let currentShowDepth = this.currentShowDepth

    // 不同的方法，深度不同
    if (isZoomIn) {
      currentShowDepth = Math.min(this.depthMax, currentShowDepth + 1)
    } else {
      // 根节点只有一个字节点时，最小深度为 2，否则为 1
      currentShowDepth = Math.max(this.depthMin, currentShowDepth - 1)
    }

    this.rootTree.depthMap.forEach((value, key) => {
      // 不同的方法，判断条件不同
      if (isZoomIn ? key > currentShowDepth : key <= currentShowDepth) return

      value.forEach((node) => {
        if (!node.data) return

        node.data.isDisplay = isZoomIn ? true : false
        node.data.TitleItem?.requestUpdate()
        node.parent?.data?.TitleItem?.requestUpdate()
      })
    })

    this.currentShowDepth = currentShowDepth
    // 当前展示的深度等于最大深度时，全部展开
    this.isAllDisplay = currentShowDepth === this.depthMax
  }

  /** 放大 Icon */
  zoomInIcon({ disabled }: { disabled: boolean }) {
    // 当前展示的深度等于最大深度时，禁用
    let _disabled = disabled || this.currentShowDepth === this.depthMax

    return html` <wc-button .disabled=${_disabled} @click=${() => this.onClickZooIcon('zoomIn')}>
      <wc-icon
        class="header_icon"
        name="zoomIn"
        size=${this.extraIconSize}
        color="var(--theme-icon)"
      ></wc-icon>
    </wc-button>`
  }

  /** 缩小 Icon */
  zoomOutIcon({ disabled }: { disabled: boolean }) {
    // 当前展示的深度等于最大深度时，禁用
    let _disabled = disabled || this.currentShowDepth === this.depthMin

    return html` <wc-button .disabled=${_disabled} @click=${() => this.onClickZooIcon('zoomOut')}>
      <wc-icon
        class="header_icon"
        name="zoomOut"
        size=${this.extraIconSize}
        color="var(--theme-icon)"
      ></wc-icon>
    </wc-button>`
  }

  /** 搜索 Icon */
  searcherIcon() {
    return html` <wc-button disabled>
      <wc-icon
        class="header_icon"
        name="searcher"
        size=${this.extraIconSize}
        color="var(--theme-icon)"
      ></wc-icon>
    </wc-button>`
  }

  moreIcon() {
    return html` <wc-button disabled>
      <wc-icon
        class="header_icon"
        name="more"
        size=${this.extraIconSize}
        color="var(--theme-icon)"
      ></wc-icon>
    </wc-button>`
  }

  onRefresh() {
    const content = extractContent()
    if (!content) return console.error('未找到文章内容')

    const TitleTree = generatorTitleTree(content)
    if (!TitleTree) return

    this.depthMax = this.rootTree.getMaxDepth()
    // 根节点只有一个字节点时，最小深度为 2，否则为 1
    this.depthMin = this.rootTree.children.length === 1 ? 2 : 1
    this.currentShowDepth = this.depthMax
    this.rootTree = TitleTree
  }

  /** 刷新 */
  refreshIcon() {
    return html` <wc-button @click=${() => this.onRefresh()}>
      <wc-icon
        class="header_icon"
        name="refresh"
        size=${this.extraIconSize}
        color="var(--theme-icon)"
      ></wc-icon>
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

    // 是否禁用展开｜闭合按钮，根节点只有一个字节点时，判断最大深度为 2，否则为 1
    const foldDisabled = this.depthMax === this.depthMin

    return html`<div>
      <wc-navigator-panel ref=${ref(this.navigatorPanelRef)}>
        <div slot="extraIcon" class="extra_icon">
          <wc-page-theme-icon
            .pageInstance=${this}
            .iconSize=${this.extraIconSize}
          ></wc-page-theme-icon>
          ${[
            this.searcherIcon(),
            this.zoomInIcon({ disabled: foldDisabled }),
            this.zoomOutIcon({ disabled: foldDisabled }),
            this.allExpandIcon({ disabled: foldDisabled }),
            this.refreshIcon(),
            this.moreIcon(),
          ]}
        </div>
        <div style="margin-top: 3px;">
          <title-tree
            .rootTree=${this.rootTree}
            .onClickItem=${this.onClickTreeItem}
            .onClickItemIcon=${() => this.onclickTreeItemIcon()}
          >
          </title-tree>
        </div>
      </wc-navigator-panel>
    </div>`
  }
}
