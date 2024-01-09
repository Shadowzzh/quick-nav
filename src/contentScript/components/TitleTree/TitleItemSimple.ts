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
        color: #3b3b3b;
      }
      :host .title {
      }
      :host .title_content {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        padding: 4px 8px;
        cursor: pointer;
      }
      :host .title_children {
      }
      :host .title_text {
        flex: 1;
      }

      :host .title_icon:hover {
        user-select: none;
      }

      :host .title_content:hover {
        background-color: #e6f7ff;
      }
    `,
  ]

  private opacity = 1

  @property({ type: Object })
  node: Tree<TitleTreeData> | null = null

  expandIconRef: Ref<HTMLElement> = createRef()

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

  render() {
    if (!this.node?.data?.element) return
    const { isDisplay, element } = this.node.data
    const isShowChildren = this.node?.children.every((child) => child.data?.isDisplay === true)

    const style: StyleInfo = {
      opacity: this.opacity,
    }
    const styleContent: StyleInfo = {
      marginLeft: `${(this.node.depth - 1) * 18}px`,
    }

    const isChildren = this.node.children.length > 0

    if (isChildren) {
      styleContent.paddingLeft = 0
    }

    if (isDisplay === false) return null

    const WCExpandIconElement = isChildren
      ? html`<wc-expand-icon
          .isExpand=${isShowChildren}
          .uniqueId=${this.node.uniqueId}
        ></wc-expand-icon>`
      : null

    return html`<div class="title">
      <div class="title_content" unique=${this.node.uniqueId} style=${styleMap(styleContent)}>
        ${WCExpandIconElement}
        <div class="title_text" style=${styleMap(style)}>${element.innerText}</div>
      </div>
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
      size="16"
      style=${styleMap(this.styleInfo)}
    ></wc-icon>`
  }
}
