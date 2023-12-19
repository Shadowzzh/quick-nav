import { LitElement, html, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import { WCIcon } from '../Icons'

@customElement('navigator-panel')
export class NavigatorPanel extends LitElement {
  static styles = [
    css`
      :host {
        z-index: 9999999;
        display: block;
        width: 300px;
        position: fixed;
        font-size: 13px;
        background-color: #fff;
        box-shadow: rgb(0 0 0 / 7%) 0px 0px 8px 1px;
        overflow: hidden;
        border-radius: 6px;
        top: 10vh;
        right: 0;
        border: 1px solid rgb(235, 238, 245);
      }

      navigator-panel {
        background-color: red;
      }

      :host .header {
        padding-top: 5px;
        padding-bottom: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        user-select: none;
      }

      :host .header .header_drag {
        color: #999;
        cursor: pointer;
      }

      :host .header .header_drag:active {
        cursor: grab;
      }

      :host .content {
        padding: 0 10px;
        padding-bottom: 5px;
      }
    `,
  ]

  /** 容器的偏移量 */
  private _offset: { top: number; left: number } = { top: 0, left: 0 }

  set offset(offset: { top: number; left: number }) {
    this._offset = offset
  }

  get offset() {
    return this._offset
  }

  constructor() {
    super()
  }

  /** 获取容器的位置 */
  getContainerRect() {
    const containerRect = this.getBoundingClientRect()
    if (containerRect) return containerRect
  }

  /** 设置容器的位置 */
  setContainerPosition(position?: { top: number; left: number }) {
    // 如果传入了位置，则设置位置
    if (position) {
      this.style.transform = `translate(${position.left}px, ${position.top}px)`
      this.offset = position
      return
    }

    // 如果没有传入位置，则获取容器的位置
    const containerRect = this.getContainerRect()

    if (!containerRect) return
    this.style.transform = `translate(${containerRect.left}px, ${containerRect.top}px)`
    this.offset = { left: containerRect.left, top: containerRect.top }
  }

  /** 鼠标按下 Drag 元素后，可进行拖动容器 */
  onDragMouseDown(downEvent: MouseEvent) {
    const { x: downX, y: downY } = downEvent
    // 鼠标按下时。鼠标位置 - 容器已经偏移的位置 = 容器的原始位置
    const originPosition = { x: downX - this.offset.left, y: downY - this.offset.top }

    /** 鼠标移动时，拖动容器 */
    const mouseMove = (e: MouseEvent) => {
      const { x: mouseX, y: mouseY } = e // 鼠标的位置离
      const moveX = mouseX - originPosition.x // 鼠标移动的距离 - X
      const moveY = mouseY - originPosition.y // 鼠标移动的距离 - Y
      this.setContainerPosition({ left: moveX, top: moveY })
    }

    // 鼠标按下后，监听鼠标移动事件, 并在鼠标抬起后移除监听
    window.addEventListener('mousemove', mouseMove)
    window.addEventListener('mouseup', () => {
      window.removeEventListener('mousemove', mouseMove)
    })
  }

  render() {
    return html`<div>
      <div class="header">
        <div class="header_drag" @mousedown=${this.onDragMouseDown}>
          ${new WCIcon({ name: 'drag', size: 20 })}
        </div>
        <div>Navigator</div>
      </div>
      <div class="content">${this.children}</div>
    </div>`
  }
}
