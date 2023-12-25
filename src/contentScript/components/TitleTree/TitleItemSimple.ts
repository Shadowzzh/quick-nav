import { html, css, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { StyleInfo, styleMap } from 'lit/directives/style-map.js'
import type { TitleTreeData } from '../../interface'
import '../Icons'
import { Tree } from '../../../utils/models/Tree'

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

      :host .title_icon {
        padding: 4px;
        margin-right: -2px;
        transition: transform 0.3s var(--animation-ease-out-quart);
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

  /** 点击展开按钮 */
  WcIcon = (function () {
    type EventMethod = 'enter' | 'leave' | null

    let eventMethod: EventMethod = null
    let target: HTMLElement | null = null

    return function (
      this: WCTitleItemSimple,
      props: { style: StyleInfo; isChildren: boolean; isShowChildren: boolean },
    ) {
      if (props.isChildren === false) return null
      const rotate = props.isShowChildren ? `rotate(0deg)` : `rotate(90deg)`

      // TODO 因为展示没有找多 CSS:hover 和 js一起使用的方法，所以使用 js 来实现 hover
      const setTransform = () => {
        if (!target) return
        if (eventMethod === 'enter') {
          target.style.transform = `scale(1.6) ${rotate}`
        } else {
          target.style.transform = `scale(1) ${rotate}`
        }
      }

      // TODO 优化 多个 ICON 事件被监听，或许可以通过事件委托来解决。 事件监听未被移除
      function mouseEnterAndLeave(e: Event, method: EventMethod) {
        target = e.target as HTMLElement
        eventMethod = method
        setTransform()
      }

      setTransform()

      return html`<wc-icon
        @mouseenter=${(e: Event) => mouseEnterAndLeave(e, 'enter')}
        @mouseleave=${(e: Event) => mouseEnterAndLeave(e, 'leave')}
        class="title_icon"
        name="arrowRight"
        unique=${this.node!.uniqueId}
        size="16"
        style=${styleMap(props?.style ?? {})}
      ></wc-icon>`
    }
  })()

  render() {
    if (!this.node?.data?.element) return
    const { isDisplay, element } = this.node.data
    const isShowChildren = this.node?.children.some((child) => child.data?.isDisplay)

    const style: StyleInfo = {
      opacity: this.opacity,
    }
    const styleContent: StyleInfo = {
      marginLeft: `${(this.node.depth - 1) * 18}px`,
    }
    const styleIcon: StyleInfo = {}

    const isChildren = this.node.children.length > 0

    if (isDisplay === false) return null

    return html`<div class="title">
      <div class="title_content" unique=${this.node.uniqueId} style=${styleMap(styleContent)}>
        ${this.WcIcon({ style: styleIcon, isShowChildren, isChildren })}
        <div class="title_text" style=${styleMap(style)}>${element.innerText}</div>
      </div>
    </div> `
  }
}
