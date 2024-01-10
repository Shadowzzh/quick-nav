import { html, css, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import PerfectScrollbar from './perfect-scrollbar'
import { Ref, createRef, ref } from 'lit/directives/ref.js'

export interface WCScrollOptions extends PerfectScrollbar.Options {}

/**
 * 滚动条组件
 * @description https://perfectscrollbar.com/options.html
 */
@customElement('wc-scroll')
export class WCScroll extends LitElement {
  static styles = [
    css`
      :host {
        width: 100%;
        height: 100%;
        display: block;
      }

      :host .wc-scroll {
        position: relative;
        width: 100%;
        height: 100%;
      }

      :host .ps {
        overflow: hidden !important;
        overflow-anchor: none;
        -ms-overflow-style: none;
        touch-action: auto;
        -ms-touch-action: auto;
      }

      .ps__rail-x {
        display: none;
        opacity: 0;
        transition:
          background-color 0.2s linear,
          opacity 0.2s linear;
        -webkit-transition:
          background-color 0.2s linear,
          opacity 0.2s linear;
        height: 15px;
        /* there must be 'bottom' or 'top' for ps__rail-x */
        bottom: 0px;
        /* please don't change 'position' */
        position: absolute;
      }

      .ps__rail-y {
        display: none;
        opacity: 0;
        transition:
          background-color 0.2s linear,
          opacity 0.2s linear;
        -webkit-transition:
          background-color 0.2s linear,
          opacity 0.2s linear;
        width: 15px;
        /* there must be 'right' or 'left' for ps__rail-y */
        right: 0;
        /* please don't change 'position' */
        position: absolute;
      }

      .ps--active-x > .ps__rail-x,
      .ps--active-y > .ps__rail-y {
        display: block;
        background-color: transparent;
      }

      .ps:hover > .ps__rail-x,
      .ps:hover > .ps__rail-y,
      .ps--focus > .ps__rail-x,
      .ps--focus > .ps__rail-y,
      .ps--scrolling-x > .ps__rail-x,
      .ps--scrolling-y > .ps__rail-y {
        opacity: 0.6;
      }

      .ps .ps__rail-x:hover,
      .ps .ps__rail-y:hover,
      .ps .ps__rail-x:focus,
      .ps .ps__rail-y:focus,
      .ps .ps__rail-x.ps--clicking,
      .ps .ps__rail-y.ps--clicking {
        background-color: transparent;
        opacity: 0.9;
      }

      .ps__thumb-x {
        background-color: #bbb;
        border-radius: 6px;
        transition:
          background-color 0.2s linear,
          height 0.2s var(--animation-ease-out-quart);
        -webkit-transition:
          background-color 0.2s linear,
          height 0.2s var(--animation-ease-out-quart);
        height: 6px;
        /* there must be 'bottom' for ps__thumb-x */
        bottom: 2px;
        /* please don't change 'position' */
        position: absolute;
      }

      .ps__thumb-y {
        background-color: #bbb;
        border-radius: 6px;
        transition:
          background-color 0.2s linear,
          width 0.2s var(--animation-ease-out-quart);
        -webkit-transition:
          background-color 0.2s linear,
          width 0.2s var(--animation-ease-out-quart);
        width: 6px;
        /* there must be 'right' for ps__thumb-y */
        right: 2px;
        /* please don't change 'position' */
        position: absolute;
      }

      .ps__rail-x:hover > .ps__thumb-x,
      .ps__rail-x:focus > .ps__thumb-x,
      .ps__rail-x.ps--clicking .ps__thumb-x {
        background-color: #aaa;
        height: 11px;
      }

      .ps__rail-y:hover > .ps__thumb-y,
      .ps__rail-y:focus > .ps__thumb-y,
      .ps__rail-y.ps--clicking .ps__thumb-y {
        background-color: #aaa;
        width: 11px;
      }

      @supports (-ms-overflow-style: none) {
        .ps {
          overflow: auto !important;
        }
      }

      @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
        .ps {
          overflow: auto !important;
        }
      }
    `,
  ]

  /** container DOM instance */
  containerRef: Ref<HTMLInputElement> = createRef()
  /** scrollbar instance */
  ps: PerfectScrollbar | null = null

  /** 如果此选项为 true，则当滚动到达一侧的末尾时，鼠标滚轮事件将传播到父元素。 */
  @property({ type: Boolean })
  wheelPropagation: WCScrollOptions['wheelPropagation'] = false

  /** 应用于鼠标滚轮事件的滚动速度。 */
  @property({ type: Number })
  wheelSpeed: WCScrollOptions['wheelSpeed'] = 2

  /** 当设置为整数值时，滚动条的拇指部分不会缩小到低于该像素数。 */
  @property({ type: Number })
  minScrollbarLength: WCScrollOptions['minScrollbarLength'] = 20

  /** 当设置为 true 时，无论内容宽度如何，X 轴上的滚动条将不可用。 */
  @property({ type: Boolean })
  suppressScrollX: WCScrollOptions['suppressScrollX'] = false

  /** 当设置为 true 时，无论内容高度如何，X 轴上的滚动条将不可用。 */
  @property({ type: Boolean })
  suppressScrollY: WCScrollOptions['suppressScrollY'] = false

  constructor(options: WCScrollOptions = {}) {
    super()
  }

  connectedCallback() {
    super.connectedCallback()
  }

  /** 在组件的 DOM 第一次更新之后、调用 update() 之前调用。 */
  protected firstUpdated() {
    if (!this.containerRef.value) return

    // 创建 scrollbar 应用
    const ps = new PerfectScrollbar(this.containerRef.value, {
      wheelPropagation: this.wheelPropagation,
      wheelSpeed: this.wheelSpeed,
      minScrollbarLength: this.minScrollbarLength,
      suppressScrollY: this.suppressScrollY,
    })

    this.ps = ps
  }

  /** 如果容器或内容的大小发生变化，请调用更新。 */
  updateScroll() {
    this.ps?.update()
  }

  render() {
    return html`<div class="wc-scroll" ${ref(this.containerRef)}>${this.children}</div>`
  }
}
