import { ReactiveController, ReactiveControllerHost } from 'lit'
import { QN } from '../interface'
import { getTanslateByElement } from '../../utils'
import { DEFAULT_CONFIG } from '../../defaultConfig'

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

// TODO 优化：如何使用Transform来修改元素大小，而不是使用width和height。
/** 改变元素大小功能 */
export class ResizeController implements ReactiveController {
  host: ReactiveControllerHost
  target: HTMLElement
  /** 改变元素大小的方向 */
  direction: Direction[] = []
  /** 最小宽度 */
  minWidth: number = DEFAULT_CONFIG.PANEL_MIN_WIDTH
  /** 最小高度 */
  minHeight: number = DEFAULT_CONFIG.PANEL_MIN_HEIGHT

  /** 被监听的内部函数 */
  private _mouseMove: null | ((e: MouseEvent) => void) = null
  /** 鼠标按下 Drag 元素后，可进行拖动容器 */
  private _onDragMouseDown: null | ((downEvent: MouseEvent) => void) = null
  /** 改变元素大小的 handler */
  private _handler: HTMLElement[] = []
  /** 元素大小改变后触发的回调列表 */
  private sizeEndCallbackTasks: ((props: { size: QN.Size; offset: QN.Position }) => void)[] = []

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
    const originOffset = getTanslateByElement(this.target)

    // 获取当前触发事件的元素
    const target = downEvent.target as HTMLElement
    const targetReact = target.getBoundingClientRect()

    const mouseInTarget = {
      // 鼠标左侧在目标元素内的距离
      left: downX - targetReact.left,
      // 鼠标右侧在目标元素内的距离
      right: targetReact.left + targetReact.width - downX,
      // 鼠标顶部在目标元素内的距离
      top: downY - targetReact.top,
      // 鼠标底部在目标元素内的距离
      bottom: targetReact.top + targetReact.height - downY,
    }

    // 保存当前帧的鼠标位置
    const size = { width: containerRect.width, height: containerRect.height }
    // 保存当前帧的偏移量
    const offset = { x: originOffset.x, y: originOffset.y }

    // 保存当前帧的 requestAnimationFrame
    let raf: number | null = null

    /** 鼠标移动时，拖动容器 */
    const mouseMoveBySize = (e: MouseEvent) => {
      raf && cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const { x: mouseX, y: mouseY } = e // 鼠标的位置离

        // 鼠标最右侧可移动最大距离限制
        const limitMouseRight = Math.min(
          mouseX,
          window.innerWidth - (DEFAULT_CONFIG.PANEL_MIN_MARGIN + mouseInTarget.right),
        )
        // 鼠标最左侧可移动最大距离限制
        const limitMouseLeft = Math.max(
          mouseX,
          DEFAULT_CONFIG.PANEL_MIN_MARGIN + mouseInTarget.left,
        )
        // 鼠标最顶部可移动最大距离限制
        const limitMouseTop = Math.max(mouseY, DEFAULT_CONFIG.PANEL_MIN_MARGIN + mouseInTarget.top)
        // 鼠标最底部可移动最大距离限制
        const limitMouseBottom = Math.min(
          mouseY,
          window.innerHeight - (DEFAULT_CONFIG.PANEL_MIN_MARGIN + mouseInTarget.bottom),
        )

        // 下一个右侧宽度
        const nextWidthByRight = Math.max(
          containerRect.width + (limitMouseRight - downX),
          this.minWidth,
        )
        // 下一个左侧宽度
        const nextWidthByLeft = Math.max(
          containerRect.width + (downX - limitMouseLeft),
          this.minWidth,
        )
        // 下一个顶部高度
        const nextHeightByTop = Math.max(
          containerRect.height + (downY - limitMouseTop),
          this.minHeight,
        )
        // 下一个底部高度
        const nextHeightByBottom = Math.max(
          containerRect.height + (limitMouseBottom - downY),
          this.minHeight,
        )

        const nextOffsetX = originOffset.x + nextWidthByRight - containerRect.width
        const nextOffsetY = originOffset.y + containerRect.height - nextHeightByTop

        offset.x = nextOffsetX
        offset.y = nextOffsetY

        const moveTop = () => {
          this.target.style.height = `${nextHeightByTop}px`
          this.target.style.transform = `translate(${originOffset.x}px, ${nextOffsetY}px)`

          size.height = nextHeightByTop
        }

        const moveRight = () => {
          this.target.style.width = `${nextWidthByRight}px`
          this.target.style.transform = `translate(${nextOffsetX}px, ${originOffset.y}px)`

          size.width = nextWidthByRight
        }

        const moveBottom = () => {
          this.target.style.height = `${nextHeightByBottom}px`

          size.height = nextHeightByBottom
        }

        const moveLeft = () => {
          this.target.style.width = `${nextWidthByLeft}px`

          size.width = nextWidthByLeft
        }

        const moveRightTop = () => {
          this.target.style.width = `${nextWidthByRight}px`
          this.target.style.height = `${nextHeightByTop}px`
          this.target.style.transform = `translate(${nextOffsetX}px, ${nextOffsetY}px)`

          size.width = nextWidthByRight
          size.height = nextHeightByTop
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
    this._mouseMove = mouseMoveBySize

    /** 鼠标抬起后， */
    const mouseUp = () => {
      window.removeEventListener('mousemove', mouseMoveBySize)
      window.removeEventListener('mouseup', mouseUp)

      this.sizeEndCallbackTasks.forEach((task) => {
        task({ size, offset: { x: offset.x, y: offset.y } })
      })
    }

    // 鼠标按下后，监听鼠标移动事件, 并在鼠标抬起后移除监听
    window.addEventListener('mousemove', mouseMoveBySize)
    window.addEventListener('mouseup', mouseUp)
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
        handler.style.width = '6px'
        handler.style.height = '6px'
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
        handler.style.width = '6px'
        handler.style.height = '6px'
        handler.style.zIndex = '2'
        break
      }

      case 'right-top': {
        handler.style.right = '0'
        handler.style.top = '0'
        handler.style.cursor = 'nesw-resize'
        handler.style.width = '6px'
        handler.style.height = '6px'
        handler.style.zIndex = '2'
        break
      }

      case 'left-top': {
        handler.style.left = '0'
        handler.style.top = '0'
        handler.style.cursor = 'nwse-resize'
        handler.style.width = '6px'
        handler.style.height = '6px'
        handler.style.zIndex = '2'
        break
      }
    }
  }

  /** 设置元素大小 */
  setSize(size: QN.Size) {
    this.target.style.width = `${size.width}px`
    this.target.style.height = `${size.height}px`
  }

  /** 元素大小改变结束后触发的回调 */
  onSizeEnd(callback: (props: { size: QN.Size; offset: QN.Position }) => void) {
    this.sizeEndCallbackTasks.push(callback)
  }

  /** 获取容器的矩形信息 */
  getContainerRect() {
    const containerRect = this.target.getBoundingClientRect()
    if (containerRect) return containerRect
  }
}
