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
  /** 改变元素大小的方向 */
  direction: Direction[] = []
  /** 最小宽度 */
  minWidth: number = 200
  /** 最小高度 */
  minHeight: number = 300

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
      this._onDragMouseDown && handler.removeEventListener('mousedown', this._onDragMouseDown)
    })
  }

  /** 鼠标按下 Drag 元素后，可进行拖动容器 */
  private onDragMouseDown(direction: Direction, downEvent: MouseEvent) {
    const { x: downX, y: downY } = downEvent
    const containerRect = this.getContainerRect()
    if (!containerRect) return

    // 获取当前容器的偏移量
    const translate = this.target.style.transform
    const match = translate.match(/translate\((.+)px,(.+)px\)/) ?? []
    const offset = {
      x: Number(match[1] ?? 0),
      y: Number(match[2] ?? 0),
    }

    let raf: number | null = null

    /** 鼠标移动时，拖动容器 */
    const mouseMove = (e: MouseEvent) => {
      raf && cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const { x: mouseX, y: mouseY } = e // 鼠标的位置离
        const diff = { x: downX - mouseX, y: downY - mouseY }

        const nextWidthDecrease = Math.max(containerRect.width + diff.x, this.minWidth)
        const nextWidthIncrease = Math.max(containerRect.width - diff.x, this.minWidth)

        const nextHeightDecrease = Math.max(containerRect.height - diff.y, this.minHeight)
        const nextHeightIncrease = Math.max(containerRect.height + diff.y, this.minHeight)

        const nextOffsetX = offset.x - (containerRect.width - nextWidthIncrease)
        const nextOffsetY = offset.y + (containerRect.height - nextHeightIncrease)

        const moveTop = () => {
          this.target.style.height = `${nextHeightIncrease}px`
          this.target.style.transform = `translate(${offset.x}px, ${nextOffsetY}px)`
        }

        const moveRight = () => {
          this.target.style.width = `${nextWidthIncrease}px`
          this.target.style.transform = `translate(${nextOffsetX}px, ${offset.y}px)`
        }

        const moveBottom = () => {
          this.target.style.height = `${nextHeightDecrease}px`
        }

        const moveLeft = () => {
          this.target.style.width = `${nextWidthDecrease}px`
        }

        const moveRightTop = () => {
          this.target.style.width = `${nextWidthIncrease}px`
          this.target.style.height = `${nextHeightIncrease}px`
          this.target.style.transform = `translate(${nextOffsetX}px, ${nextOffsetY}px)`
        }

        switch (direction) {
          case 'top': {
            moveTop()
            break
          }
          case 'right': {
            moveRight()
            break
          }
          case 'bottom': {
            moveBottom()
            break
          }
          case 'left': {
            moveLeft()
            break
          }
          case 'left-bottom': {
            moveLeft()
            moveBottom()
            break
          }
          case 'left-top': {
            moveLeft()
            moveTop()
            break
          }
          case 'right-bottom': {
            moveRight()
            moveBottom()
            break
          }
          case 'right-top': {
            moveRightTop()
            break
          }
        }
      })
    }
    this._mouseMove = mouseMove

    // 鼠标按下后，监听鼠标移动事件, 并在鼠标抬起后移除监听
    window.addEventListener('mousemove', mouseMove)
    window.addEventListener('mouseup', () => {
      window.removeEventListener('mousemove', mouseMove)
    })
  }

  /** 创建大小改变的handler */
  private createSizeHandler(direction: Direction) {
    const handler = document.createElement('div')
    const handlerFragment = document.createDocumentFragment().appendChild(handler)

    this.setStyleByDirection(handlerFragment, direction)

    const onDragMouseDown = this.onDragMouseDown.bind(this, direction)
    this._onDragMouseDown = onDragMouseDown

    handler.addEventListener('mousedown', onDragMouseDown)

    return handler
  }

  /** 根据方向设置样式 */
  private setStyleByDirection(handler: HTMLElement, direction: Direction) {
    handler.style.position = 'absolute'
    handler.style.zIndex = '1'
    handler.style.display = 'block'
    handler.style.userSelect = 'none'

    switch (direction) {
      case 'left': {
        handler.style.left = '0'
        handler.style.top = '0'
        handler.style.cursor = 'ew-resize'
        handler.style.width = '6px'
        handler.style.height = '100%'
        break
      }

      case 'top': {
        handler.style.top = '0'
        handler.style.width = '100%'
        handler.style.cursor = 'ns-resize'
        handler.style.height = '6px'
        handler.style.left = '0'
        break
      }

      case 'bottom': {
        handler.style.bottom = '0'
        handler.style.width = '100%'
        handler.style.cursor = 'ns-resize'
        handler.style.height = '6px'
        handler.style.left = '0'
        break
      }

      case 'left-bottom': {
        handler.style.left = '0'
        handler.style.bottom = '0'
        handler.style.cursor = 'nesw-resize'
        handler.style.width = '10px'
        handler.style.height = '10px'
        handler.style.zIndex = '2'
        break
      }

      case 'right': {
        handler.style.right = '0'
        handler.style.top = '0'
        handler.style.cursor = 'ew-resize'
        handler.style.width = '6px'
        handler.style.height = '100%'
        break
      }

      case 'right-bottom': {
        handler.style.right = '0'
        handler.style.bottom = '0'
        handler.style.cursor = 'nwse-resize'
        handler.style.width = '10px'
        handler.style.height = '10px'
        handler.style.zIndex = '2'
        break
      }

      case 'right-top': {
        handler.style.right = '0'
        handler.style.top = '0'
        handler.style.cursor = 'nesw-resize'
        handler.style.width = '10px'
        handler.style.height = '10px'
        handler.style.zIndex = '2'
        break
      }

      case 'left-top': {
        handler.style.left = '0'
        handler.style.top = '0'
        handler.style.cursor = 'nwse-resize'
        handler.style.width = '10px'
        handler.style.height = '10px'
        handler.style.zIndex = '2'
        break
      }
    }
  }

  /** 获取容器的矩形信息 */
  getContainerRect() {
    const containerRect = this.target.getBoundingClientRect()
    if (containerRect) return containerRect
  }
}
