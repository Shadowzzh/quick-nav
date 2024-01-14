import { LitElement, PropertyValueMap, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { Ref, createRef, ref } from 'lit/directives/ref.js'

import type { WCNavigatorPanel } from '../../components/NavigatorPanel'
import type { TitleTreeData } from '../../interface'
import type { WCPageZoomIcon } from './ZoomIcon'
import type { WCPageAllExpandIcon } from './AllExpandIcon'
import type { WCPageRefreshIcon } from './RefreshIcon'

import '../../components/TitleTree'
import '../../components/NavigatorPanel'
import './ThemeIcon'
import './AllExpandIcon'
import './ZoomIcon'
import './RefreshIcon'
import { TitleTreeComponent } from '../../components/TitleTree'

import { Tree } from '@/utils/models'
import { scrollSmoothTo } from '@/utils'

import { getScrollElement } from '../../analysis'
import { Anchor, ObserverViewController } from './ObserverViewController'

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
  @property({ type: Number })
  depthMax: number = 0

  /** 最小的深度 */
  @property({ type: Number })
  depthMin: number = 0

  /** 额外的 Icon 大小 */
  @property({ type: Number })
  extraIconSize = 16

  /** 导航面板 Ref */
  navigatorPanelRef: Ref<WCNavigatorPanel> = createRef()

  private content: HTMLElement

  private observerViewController = new ObserverViewController(this)

  constructor(props: { rootTree: Tree<TitleTreeData>; content: HTMLElement }) {
    super()
    this.rootTree = props.rootTree
    this.content = props.content
    this.initialize()
  }

  /** 初始化 */
  initialize() {
    // 根节点只有一个字节点时，最小深度为 2，否则为 1
    this.depthMin = this.rootTree.children.length === 1 ? 2 : 1
    this.depthMax = this.rootTree.getMaxDepth()
    this.currentShowDepth = this.depthMax

    this.observerViewController.setInfo({
      onInView: (params) => this.onNodeInView(params),
      tree: this.rootTree,
      container: this.content,
    })
  }

  disconnectedCallback(): void {}

  /** 更新时 */
  protected updated(propertyValueMap: PropertyValueMap<WCPage>) {
    if (propertyValueMap.has('rootTree')) {
      TitleTreeComponent.TreeMap.clear()
      TitleTreeComponent.childActiveTree.clear()

      this.rootTree?.eachChild((child) => {
        // 将所有的节点存入 map 中
        TitleTreeComponent.TreeMap.set(child.uniqueId, child)
      })
    }
  }

  /** 当前节点在视图中出现 */
  onNodeInView({ anchor }: { anchor: Anchor }) {
    this.keepViewInto(anchor)
  }

  /** 控制 scroll 滚动，使选中的 item 保存在视图中 */
  keepViewInto(anchor: Anchor) {
    const node = anchor.node
    if (!node.data?.TitleItem) return

    const titleItem = node.data.TitleItem

    const scrollInstance = this.navigatorPanelRef.value?.getScrollInstance()
    const titleOffset = { top: titleItem.offsetTop, height: titleItem.offsetHeight }

    /** childActive 的总高度 */
    const activeNodeHeight = (() => {
      let height = 0
      TitleTreeComponent.childActiveTree.forEach((node) => {
        height += node.data?.TitleItem?.offsetHeight ?? 0
      })
      return height
    })()

    if (!scrollInstance?.ps) return
    const scrollElement = scrollInstance.ps.element

    // 是否在视图上方
    const isViewTop = titleOffset.top - activeNodeHeight >= scrollElement.scrollTop
    // 如果不在视图上方，则滚动到视图上方
    if (isViewTop === false) {
      const target = titleOffset.top - activeNodeHeight
      scrollSmoothTo({ container: scrollElement, target })
    }

    // 是否在视图下方
    const isViewBottom =
      scrollElement.scrollTop + scrollElement.offsetHeight >= titleOffset.top + titleOffset.height
    // 如果不在视图下方，则滚动到视图下方
    if (isViewBottom === false) {
      const target = titleOffset.top + titleOffset.height - scrollElement.offsetHeight
      scrollSmoothTo({ container: scrollElement, target })
    }
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

  /** 点击树的 item */
  onClickTreeItem(params: Parameters<Exclude<TitleTreeComponent['onClickItem'], undefined>>[0]) {
    const container = getScrollElement(params.target)
    scrollSmoothTo({ target: params.target, container })
  }

  /** 点击树的 item icon */
  onclickTreeItemIcon() {
    this.onUpdateNavigatorScroll()
  }

  /** 一些可能导致 scroll 变化的操作，需要主动调用更新 */
  onUpdateNavigatorScroll() {
    requestAnimationFrame(() => {
      this.navigatorPanelRef.value?.scrollUpdate()
    })
  }

  /** 点击全部展开时 - 触发*/
  onClickAllExpand({
    isAllDisplay: isAllDisplay,
  }: Parameters<WCPageAllExpandIcon['onClickAllExpand']>[0]) {
    this.currentShowDepth = isAllDisplay ? this.depthMax : this.depthMin
    this.isAllDisplay = isAllDisplay
    this.onUpdateNavigatorScroll()
  }

  /** 点击放大镜 - 触发 */
  onClickZoom({ currentShowDepth }: Parameters<WCPageZoomIcon['onClickZoom']>[0]) {
    // 当前展示的深度等于最大深度时，全部展开
    this.isAllDisplay = currentShowDepth === this.depthMax
    this.currentShowDepth = currentShowDepth
    this.onUpdateNavigatorScroll()
  }

  /** 点击刷新时 - 触发 */
  onClickRefresh({ TitleTree }: Parameters<WCPageRefreshIcon['onClickRefresh']>[0]) {
    this.rootTree = TitleTree
    this.initialize()
    this.onUpdateNavigatorScroll()
  }

  render() {
    if (this.rootTree === null) return

    return html`<div>
      <wc-navigator-panel ref=${ref(this.navigatorPanelRef)}>
        <div slot="extraIcon" class="extra_icon">
          <!-- 主题色功能 -->
          <wc-page-theme-icon
            .pageInstance=${this}
            .iconSize=${this.extraIconSize}
          ></wc-page-theme-icon>

          <!-- 放大功能 -->
          <wc-page-zoom-icon
            mode="zoomIn"
            .iconSize=${this.extraIconSize}
            .isAllDisplay=${this.isAllDisplay}
            .currentShowDepth=${this.currentShowDepth}
            .depthMax=${this.depthMax}
            .depthMin=${this.depthMin}
            .rootTree=${this.rootTree}
            .onClickZoom=${(params: Parameters<WCPageZoomIcon['onClickZoom']>[0]) =>
              this.onClickZoom(params)}
          ></wc-page-zoom-icon>

          <!-- 缩小功能 -->
          <wc-page-zoom-icon
            mode="zoomOut"
            .iconSize=${this.extraIconSize}
            .isAllDisplay=${this.isAllDisplay}
            .currentShowDepth=${this.currentShowDepth}
            .depthMax=${this.depthMax}
            .depthMin=${this.depthMin}
            .rootTree=${this.rootTree}
            .onClickZoom=${(params: Parameters<WCPageZoomIcon['onClickZoom']>[0]) =>
              this.onClickZoom(params)}
          ></wc-page-zoom-icon>

          <!-- 一键全部展开｜关闭功能 -->
          <wc-page-all-expand-icon
            .iconSize=${this.extraIconSize}
            .isAllDisplay=${this.isAllDisplay}
            .currentShowDepth=${this.currentShowDepth}
            .depthMax=${this.depthMax}
            .depthMin=${this.depthMin}
            .rootTree=${this.rootTree}
            .onClickAllExpand=${(params: Parameters<WCPageAllExpandIcon['onClickAllExpand']>[0]) =>
              this.onClickAllExpand(params)}
          >
          </wc-page-all-expand-icon>

          <!-- 刷新功能 -->
          <wc-page-refresh-icon
            .iconSize=${this.extraIconSize}
            .rootTree=${this.rootTree}
            .onClickRefresh=${(params: Parameters<WCPageRefreshIcon['onClickRefresh']>[0]) =>
              this.onClickRefresh(params)}
          >
          </wc-page-refresh-icon>

          <!-- ${[this.searcherIcon(), this.moreIcon()]} -->
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
