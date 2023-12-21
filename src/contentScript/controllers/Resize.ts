import { ReactiveController, ReactiveControllerHost } from 'lit'

interface ResizeControllerOptions {
  target: HTMLElement
  direction: Direction[]
}

type Direction =
  | 'left'
  | 'right'
  | 'bottom'
  | 'top'
  | 'left-top'
  | 'right-top'
  | 'left-bottom'
  | 'right-bottom'

/** 改变元素大小功能 */
export class ResizeController implements ReactiveController {
  host: ReactiveControllerHost
  target: HTMLElement

  direction: Direction[] = []

  /** 被监听的内部函数 */
  private _mouseMove: null | ((e: MouseEvent) => void) = null
  /** 鼠标按下 Drag 元素后，可进行拖动容器 */
  private _onDragMouseDown: null | ((downEvent: MouseEvent) => void) = null
  /** 改变元素大小的 handler */
  private _handler: HTMLElement[] = []

  constructor(host: ReactiveControllerHost, options: ResizeControllerOptions) {
    ;(this.host = host).addController(this)
    this.target = options.target
    this.direction = options.direction
  }

  hostConnected() {
    // 获取目标元素
    const target = this.target.shadowRoot ? this.target.shadowRoot : this.target

    // 创建大小改变的handler
    this.direction.forEach((direction) => {
      const directionHandle = this.createSizeHandler(direction)
      this._handler.push(directionHandle)
      target.appendChild(directionHandle)
    })
  }

  hostDisconnected() {
    // 移除鼠标移动事件
    this._mouseMove && window.removeEventListener('mousemove', this._mouseMove)
    this._handler.forEach((handler) => {
      handler.removeEventListener('mousedown', this._onDragMouseDown)
    })
  }

  /** 鼠标按下 Drag 元素后，可进行拖动容器 */
  onDragMouseDown(direction: Direction, downEvent: MouseEvent) {
    const { x: downX, y: downY } = downEvent
    const containerRect = this.getContainerRect()
    if (!containerRect) return

    /** 鼠标移动时，拖动容器 */
    const mouseMove = (e: MouseEvent) => {
      const { x: mouseX, y: mouseY } = e // 鼠标的位置离

      // 改变宽度
      const resizeWidth = () => {
        const resizeWidth = containerRect.width + (downX - mouseX)
        this.target.style.width = `${resizeWidth}px`
      }

      // 改变高度
      const resizeHeight = () => {
        const resizeHeight = containerRect.height + (mouseY - downY)
        this.target.style.height = `${resizeHeight}px`
      }

      switch (direction) {
        case 'left':
          resizeWidth()
          break

        case 'bottom':
          resizeHeight()
          break

        case 'left-bottom': {
          resizeWidth()
          resizeHeight()
          break
        }
      }
    }
    this._mouseMove = mouseMove

    // 鼠标按下后，监听鼠标移动事件, 并在鼠标抬起后移除监听
    window.addEventListener('mousemove', mouseMove)
    window.addEventListener('mouseup', () => {
      window.removeEventListener('mousemove', mouseMove)
    })
  }

  /** 创建大小改变的handler */
  createSizeHandler(direction: Direction) {
    const handler = document.createElement('div')
    this.setStyleByDirection(handler, direction)

    const onDragMouseDown = this.onDragMouseDown.bind(this, direction)
    this._onDragMouseDown = onDragMouseDown

    handler.addEventListener('mousedown', onDragMouseDown)
    handler.addEventListener('mouseup', () => {
      handler.removeEventListener('mousedown', onDragMouseDown)
    })

    return handler
  }

  /** 根据方向设置样式 */
  setStyleByDirection(handler: HTMLElement, direction: Direction) {
    handler.style.position = 'absolute'
    handler.style.backgroundColor = 'red'
    handler.style.zIndex = '1'
    handler.style.display = 'block'
    handler.style.userSelect = 'none'

    if (direction === 'left') {
      handler.style.left = '0'
      handler.style.top = '0'
      handler.style.cursor = 'ew-resize'
      handler.style.width = '6px'
      handler.style.height = '100%'
    }

    if (direction === 'bottom') {
      handler.style.bottom = '0'
      handler.style.width = '100%'
      handler.style.cursor = 'ns-resize'
      handler.style.height = '6px'
      handler.style.left = '0'
    }

    if (direction === 'left-bottom') {
      handler.style.left = '0'
      handler.style.bottom = '0'
      handler.style.cursor = 'nesw-resize'
      handler.style.width = '10px'
      handler.style.height = '10px'
      handler.style.zIndex = '2'
    }
  }

  /** 获取容器的巨型信息 */
  getContainerRect() {
    const containerRect = this.target.getBoundingClientRect()
    if (containerRect) return containerRect
  }
}
