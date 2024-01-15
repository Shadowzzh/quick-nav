import { html, css, LitElement, PropertyValueMap } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { StyleInfo, styleMap } from 'lit/directives/style-map.js'

type EventMethod = 'enter' | 'leave' | null

@customElement('wc-title-item-arrow-icon')
export class WCTitleItemArrowIcon extends LitElement {
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

  /** 是否展开 */
  @property({ type: Boolean })
  isExpand: boolean = true

  /** 唯一标识 */
  @property({ type: String })
  uniqueId: String = ''

  /** 样式 */
  styleInfo: StyleInfo = {}

  /** 事件方法 */
  private eventMethod: EventMethod = null

  constructor() {
    super()
  }

  connectedCallback(): void {
    super.connectedCallback()
    this.setTransform()
  }

  protected updated(changedProperties: PropertyValueMap<WCTitleItemArrowIcon>) {
    // isExpand 属性变动后，设置 transform 属性
    if (changedProperties.has('isExpand')) {
      this.setTransform()
    }
  }

  /** 设置 transform 属性 */
  setTransform() {
    const rotate = this.isExpand ? `rotate(90deg)` : `rotate(0deg)`

    if (this.eventMethod === 'enter') {
      this.style.transform = `scale(1.6) ${rotate}`
    } else {
      this.style.transform = `scale(1) ${rotate}`
    }
  }

  // TODO 优化 多个 ICON 事件被监听，或许可以通过事件委托来解决。 事件监听未被移除
  mouseEnterAndLeave(_: Event, method: EventMethod) {
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
