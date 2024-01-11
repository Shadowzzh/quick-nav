import { html, css, LitElement, PropertyValueMap } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { StyleInfo, styleMap } from 'lit/directives/style-map.js'
import type { TitleTreeData } from '../../interface'
import { Tree } from '../../../utils/models/Tree'
import { Ref, createRef, ref } from 'lit/directives/ref.js'
import '../Icons'

export interface WCTitleItemSimpleOptions {}

@customElement('wc-title-item-simple')
export class WCTitleItemSimple extends LitElement {
  static styles = [
    css`
      :host {
        background-color: var(--theme-background);
        font-size: 13px;
        position: relative;
        box-sizing: border-box;
        margin-right: 16px;
        margin-bottom: 1px;
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

      :host .title_content {
        position: relative;
        z-index: 2;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        padding: 4px 8px;
        /* transition: background-color 0.1s var(--animation-ease-out-quart); */
      }

      :host .title_content:hover {
        /* background-color: var(--theme-background); */
        border-radius: 4px;
      }

      :host .title_children {
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

  private opacity = 1

  @property({ type: Object })
  node: Tree<TitleTreeData> | null = null

  expandIconRef: Ref<HTMLElement> = createRef()

  @property({ type: String })
  backgroundOrigin: string = ''

  /** 鼠标是否在 元素内 */
  @property({ type: Boolean })
  atInside: boolean = false

  constructor(options: WCTitleItemSimpleOptions) {
    super()
  }

  connectedCallback(): void {
    super.connectedCallback()

    if (this.node) {
      this.opacity = 1 - this.node.depth * 0.15
      if (this.node.data) {
        this.node.data.TitleItem = this
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
    const thisHeight = this.offsetHeight - 1
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
        transform: `translateX(6px) scale(1, 1.05)`,
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
      ? html`<wc-expand-icon
          .isExpand=${isShowChildren}
          .uniqueId=${this.node.uniqueId}
        ></wc-expand-icon>`
      : null

    return html`<div
      class="title"
      unique=${this.node.uniqueId}
      style=${styleMap(titleStyle)}
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
    </div> `
  }
}

type EventMethod = 'enter' | 'leave' | null
@customElement('wc-expand-icon')
class WCExpandIcon extends LitElement {
  static styles = css`
    :host {
      padding: 4px;
      margin: -4px;
      margin-right: -2px;
      margin-left: 0px;
      user-select: none;
      transition: transform 0.3s var(--animation-ease-out-quart);
    }
  `

  eventMethod: EventMethod = null
  @property({ type: Boolean })
  isExpand: boolean = true

  @property({ type: String })
  uniqueId: String = ''

  styleInfo: StyleInfo = {}

  constructor() {
    super()
  }

  connectedCallback(): void {
    super.connectedCallback()
    this.setTransform()
  }

  protected updated(_changedProperties: PropertyValueMap<WCExpandIcon>): void {
    if (_changedProperties.has('isExpand')) {
      this.setTransform()
    }
  }

  setTransform() {
    const rotate = this.isExpand ? `rotate(90deg)` : `rotate(0deg)`

    if (this.eventMethod === 'enter') {
      this.style.transform = `scale(1.6) ${rotate}`
    } else {
      this.style.transform = `scale(1) ${rotate}`
    }
  }

  // TODO 优化 多个 ICON 事件被监听，或许可以通过事件委托来解决。 事件监听未被移除
  mouseEnterAndLeave(e: Event, method: EventMethod) {
    this.eventMethod = method
    this.setTransform()
  }

  render() {
    return html`<wc-icon
      @mouseenter=${(e: Event) => this.mouseEnterAndLeave(e, 'enter')}
      @mouseleave=${(e: Event) => this.mouseEnterAndLeave(e, 'leave')}
      class="title_icon"
      name="arrowRight"
      unique=${this.uniqueId}
      is_expand=${Number(this.isExpand)}
      size="16"
      style=${styleMap(this.styleInfo)}
    ></wc-icon>`
  }
}
