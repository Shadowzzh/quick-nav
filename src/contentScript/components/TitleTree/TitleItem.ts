import { html, css, LitElement, PropertyValueMap } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { StyleInfo, styleMap } from 'lit/directives/style-map.js'
import { Ref, createRef } from 'lit/directives/ref.js'

import { Tree } from '@/utils/models'

import type { TitleTreeData } from '../../interface'
import '../Icons'
import './TitleItemArrowIcon'

export interface WCTitleItemOptions {}

@customElement('wc-title-item')
export class WCTitleItem extends LitElement {
  static styles = [
    css`
      :host {
        background-color: var(--theme-background);
        font-size: 13px;
        position: relative;
        box-sizing: border-box;
        padding-right: 16px;
        display: block;
      }

      :host * {
        box-sizing: border-box;
      }
      :host .title {
        color: var(--theme-color);
        transition:
          0.3s background-color var(--animation-ease-out-quart),
          0.25s transform var(--animation-ease-out-quart);
        border-radius: 4px;
        cursor: pointer;
      }

      :host .title_inner {
        position: relative;
      }

      :host .title_content {
        position: relative;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        z-index: 2;

        padding: 4px 8px;
      }

      :host .title_content:hover {
        border-radius: 4px;
      }

      :host .title_text {
        flex: 1;
      }

      :host .title_icon:hover {
        user-select: none;
      }

      :host .title_background {
        transform-origin: 100% 84%;
        transform: scale(0.7) translate(0px, 0px);

        background-color: var(--theme-item-hover-background);
        border-radius: 4px;
        bottom: 0;
        left: 0;
        opacity: 0;
        pointer-events: none;
        position: absolute;
        right: 0;
        top: 0;
        transition:
          transform 0.25s var(--animation-ease-out-circ),
          opacity 0.25s var(--animation-ease-out-circ);
        z-index: 1;
      }

      :host .title:hover .title_background {
        transform: scale(1) translate(0px, 0px);
      }
    `,
  ]

  @property({ type: Number })
  opacity = 1

  @property({ type: Object })
  node: Tree<TitleTreeData> | null = null

  expandIconRef: Ref<HTMLElement> = createRef()

  @property({ type: String })
  backgroundOrigin: string = ''

  /** 鼠标是否在 元素内 */
  @property({ type: Boolean })
  atInside: boolean = false

  constructor(options: WCTitleItemOptions) {
    super()
  }

  protected updated(changedProperties: PropertyValueMap<WCTitleItem>) {
    if (changedProperties.has('node')) {
      if (this.node) {
        this.opacity = 1 - this.node.depth * 0.15
        if (this.node.data) {
          this.node.data.TitleItem = this
        }
      }
    }
  }

  /** 计算 transform-origin 属性 */
  private calcOrigin(e: MouseEvent) {
    const { x, y } = e
    const containerRect = this.getBoundingClientRect()

    const xByContainer = x - containerRect.left
    const yByContainer = y - containerRect.top
    const xOrigin = Math.round((xByContainer / containerRect.width) * 100)
    const yOrigin = Math.round((yByContainer / containerRect.height) * 100)

    this.backgroundOrigin = `${xOrigin}% ${yOrigin}%`
  }

  render() {
    if (!this.node?.data?.element) return
    const { isDisplay, element, isActive, childActive } = this.node.data
    // TODO 重排
    const thisHeight = this.offsetHeight - 0.5
    const isShowChildren = this.node?.children.every((child) => child.data?.isDisplay === true)

    const isChildren = this.node.children.length > 0

    let titleStyle: StyleInfo = {}

    const textStyle: StyleInfo = {
      opacity: this.opacity,
    }

    const contentStyle: StyleInfo = {
      marginLeft: `${(this.node.depth - 1) * 18}px`,
    }

    let backgroundStyle: StyleInfo = {
      transformOrigin: this.backgroundOrigin,
      opacity: this.atInside ? 1 : 0,
    }

    if (isChildren) {
      contentStyle.paddingLeft = 0
    }

    if (isDisplay === false) return null

    if (isActive === true) {
      backgroundStyle = {
        transform: `none !important`,
      }
      titleStyle = {
        color: `var(--theme-selectedColor)`,
        backgroundColor: `var(--theme-selectedBackground)`,
        transform: `translate(6px, -2px) scale(1, 1.05)`,
        zIndex: `2`,
      }
    }

    // TODO 优化
    if (childActive === true) {
      titleStyle.color = 'var(--theme-primary)'
      titleStyle.fontWeight = 'bold'
      this.style.position = 'sticky'
      this.style.top = `${(this.node.depth - 1) * thisHeight}px`
      this.style.zIndex = '3'
    } else {
      this.style.position = 'none'
      this.style.zIndex = 'auto'
      this.style.top = `unset`
    }

    const WCExpandIconElement = isChildren
      ? html`<wc-title-item-arrow-icon
          .isExpand=${isShowChildren}
          .uniqueId=${this.node.uniqueId}
        ></wc-title-item-arrow-icon>`
      : null

    return html`<div class="title" unique=${this.node.uniqueId} style=${styleMap(titleStyle)}>
      <div
        class="title_inner"
        @mouseenter=${(e: MouseEvent) => {
          if (this.node?.data?.isActive === false) {
            this.calcOrigin(e)
          }
          this.atInside = true
        }}
        @mouseleave=${(e: MouseEvent) => {
          if (this.node?.data?.isActive === false) {
            this.calcOrigin(e)
          }
          this.atInside = false
        }}
      >
        <div class="title_content" style=${styleMap(contentStyle)}>
          ${WCExpandIconElement}
          <span class="title_text" style=${styleMap(textStyle)}>${element.innerText}</span>
        </div>

        <span class="title_background" style=${styleMap(backgroundStyle)}></span>
      </div>
    </div> `
  }
}
