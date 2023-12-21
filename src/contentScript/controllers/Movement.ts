import { ReactiveController, ReactiveControllerHost } from 'lit'

interface MovementControllerOptions {
  target: HTMLElement
}

/** 元素移动功能 */
export class MovementController implements ReactiveController {
  host: ReactiveControllerHost

  target: HTMLElement

  /** 容器的偏移量 */
  private _offset: { top: number; left: number } = { top: 0, left: 0 }

  set offset(offset: { top: number; left: number }) {
    this._offset = offset
  }

  get offset() {
    return this._offset
  }

  /** 被监听的内部函数 */
  private _mouseMove: null | ((e: MouseEvent) => void) = null

  constructor(host: ReactiveControllerHost, options: MovementControllerOptions) {
    ;(this.host = host).addController(this)
    this.target = options.target

    this.dragMouseDown = this.dragMouseDown.bind(this)
  }

  hostConnected() {}

  hostDisconnected() {
    // 移除鼠标移动事件
    this._mouseMove && window.removeEventListener('mousemove', this._mouseMove)
  }

  /** 获取容器的位置 */
  getContainerRect() {
    const containerRect = this.target.getBoundingClientRect()
    if (containerRect) return containerRect
  }

  /** 设置容器的位置 */
  setContainerPosition(position?: { top: number; left: number }) {
    // 如果传入了位置，则设置位置
    if (position) {
      this.target.style.transform = `translate(${position.left}px, ${position.top}px)`
      this.offset = position
      return
    }

    // 如果没有传入位置，则获取容器的位置
    const containerRect = this.getContainerRect()

    if (!containerRect) return
    this.target.style.transform = `translate(${containerRect.left}px, ${containerRect.top}px)`
    this.offset = { left: containerRect.left, top: containerRect.top }
  }

  /** 鼠标按下 Drag 元素后，可进行拖动容器 */
  dragMouseDown(downEvent: MouseEvent) {
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

    this._mouseMove = mouseMove

    // 鼠标按下后，监听鼠标移动事件, 并在鼠标抬起后移除监听
    window.addEventListener('mousemove', mouseMove)
    window.addEventListener('mouseup', () => {
      window.removeEventListener('mousemove', mouseMove)
    })
  }
}
