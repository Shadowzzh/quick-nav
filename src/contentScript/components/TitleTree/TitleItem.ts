import { html, LitElement, PropertyValueMap } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { StyleInfo, styleMap } from 'lit/directives/style-map.js'
import { classMap } from 'lit/directives/class-map.js'
import { Ref, createRef } from 'lit/directives/ref.js'

import { Tree } from '@/utils/models'

import type { TitleTreeData } from '../../interface'
import '../Icons'
import './TitleItemArrowIcon'
import { WCTitleItemStyle } from './styles'
import { TitleTreeComponent } from '.'

export interface WCTitleItemOptions {}

@customElement('wc-title-item')
export class WCTitleItem extends LitElement {
  static styles = WCTitleItemStyle

  /** 透明度 */
  @property({ type: Number })
  opacity = 1

  /** 标题树 */
  @property({ type: Object })
  node: Tree<TitleTreeData> | null = null

  /** 背景图片 transform-origin 属性 */
  @property({ type: String })
  backgroundOrigin: string = ''

  /** 鼠标是否在 元素内 */
  @property({ type: Boolean })
  atInside: boolean = false

  @property({ type: Object })
  classes = {
    title: true,
    'title--parent': false,
    'title--active': false,
    'title--activeChild': false,
  }

  /** 展开按钮 */
  expandIconRef: Ref<HTMLElement> = createRef()

  /** 元素 rect */
  rect: DOMRect | undefined = undefined

  /** 基本的 item 左边距 */
  baseItemMarginLeft = 18

  constructor(options: WCTitleItemOptions) {
    super()
  }

  /** 更新 */
  protected updated(changedProperties: PropertyValueMap<WCTitleItem>) {
    // node 属性变动时
    if (changedProperties.has('node')) {
      if (!this.node?.data) return

      this.rect = this.getBoundingClientRect()

      // 关联 TitleItem 到 node.data
      this.node.data.TitleItem = this
      // 更新 opacity
      this.opacity = 1 - this.node.depth * 0.15

      TitleTreeComponent.elementMap.set(this.node.data.element, this.node)
    }
  }

  /**
   * 计算 transform-origin 属性
   * @param isInside 是否在元素内
   */
  private computedOrigin(e: MouseEvent, isInside: boolean = false) {
    this.atInside = isInside
    // 如果是激活状态，不计算
    if (this.node?.data?.isActive === true) return

    const { x, y } = e
    const containerRect = this.getBoundingClientRect()

    const xByContainer = x - containerRect.left
    const yByContainer = y - containerRect.top

    const xOrigin = Math.round((xByContainer / containerRect.width) * 100)
    const yOrigin = Math.round((yByContainer / containerRect.height) * 100)

    this.backgroundOrigin = `${xOrigin}% ${yOrigin}%`
  }

  /** 是否显示了子节点 */
  getIsDisplayChildren() {
    return this.node?.children.every((child) => child.data?.isDisplay === true) ?? false
  }

  /** 计算 style */
  computedStyle(params: { data: TitleTreeData; isChildren: boolean; depth: number }) {
    const { data, isChildren, depth } = params
    const { isActive, childActive } = data

    this.classes['title--parent'] = isChildren
    this.classes['title--active'] = isActive
    this.classes['title--activeChild'] = childActive

    /** 计算文本样式 */
    const computedTextStyle = () => {
      const textStyle: StyleInfo = {
        opacity: this.opacity,
      }

      return textStyle
    }

    /** 计算内容样式 */
    const computedContentStyle = () => {
      const contentStyle: StyleInfo = {
        marginLeft: `${(depth - 1) * this.baseItemMarginLeft}px`,
      }

      return contentStyle
    }

    /** 计算标题样式 */
    const computedTitleStyle = () => {
      let titleStyle: StyleInfo = {}

      return titleStyle
    }

    /** 计算背景样式 */
    const computedBackgroundStyle = () => {
      const backgroundStyle: StyleInfo = {}

      if (this.backgroundOrigin) {
        backgroundStyle.transformOrigin = this.backgroundOrigin
      }

      if (isActive === false) {
        backgroundStyle.opacity = this.atInside ? 1 : 0
      }

      return backgroundStyle
    }

    const computedSelfStyle = () => {
      if (childActive === true && this.rect) {
        this.style.position = 'sticky'
        this.style.top = `${(depth - 1) * this.rect.height - 0.5}px`
        this.style.zIndex = '3'
      } else {
        this.style.position = 'none'
        this.style.zIndex = 'auto'
        this.style.top = `unset`
      }
    }
    computedSelfStyle()

    return {
      contentStyle: computedContentStyle(),
      titleStyle: computedTitleStyle(),
      backgroundStyle: computedBackgroundStyle(),
      textStyle: computedTextStyle(),
    }
  }

  /** 渲染展开按钮 */
  TitleItemArrowIcon(isChildren: boolean) {
    const isDisplayChildren = this.getIsDisplayChildren()
    if (!this.node || !isChildren) return null

    return html`<wc-title-item-arrow-icon
      .isExpand=${isDisplayChildren}
      .uniqueId=${this.node.uniqueId}
    ></wc-title-item-arrow-icon>`
  }

  render() {
    if (!this.node?.data?.element) return
    const { isDisplay, element, isDestroyed } = this.node.data

    // 不显示本组件
    if (isDisplay === false || isDestroyed === true) return null

    const isChildren = this.node.children.length > 0

    const { contentStyle, titleStyle, backgroundStyle, textStyle } = this.computedStyle({
      data: this.node.data,
      isChildren,
      depth: this.node.depth,
    })

    return html`<div
      class=${classMap(this.classes)}
      style=${styleMap(titleStyle)}
      unique=${this.node.uniqueId}
      title=${element.innerText}
    >
      <div
        class="title_inner"
        @mouseenter=${(e: MouseEvent) => this.computedOrigin(e, true)}
        @mouseleave=${(e: MouseEvent) => this.computedOrigin(e, false)}
      >
        <div class="title_content" style=${styleMap(contentStyle)}>
          ${this.TitleItemArrowIcon(isChildren)}
          <span class="title_text" style=${styleMap(textStyle)}>${element.innerText}</span>
        </div>

        <!-- 背景动画 -->
        <span class="title_background" style=${styleMap(backgroundStyle)}></span>
      </div>
    </div> `
  }
}
