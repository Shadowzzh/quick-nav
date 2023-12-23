import { ReactiveController, ReactiveControllerHost } from 'lit'
import { QN } from '../interface'
import { getOffsetByElement } from '../../utils'

interface MovementControllerOptions {
  target: HTMLElement
  position?: QN.Position
}

/** 元素移动功能 */
export class MovementController implements ReactiveController {
  host: ReactiveControllerHost

  target: HTMLElement

  /** 容器的偏移量 */
  private _offset: QN.Position = { top: 0, left: 0 }

  set offset(offset: QN.Position) {
    this._offset = offset
  }

  get offset() {
    return this._offset
  }

  /** 被监听的内部函数 */
  private _mouseMove: null | ((e: MouseEvent) => void) = null

  /** 移动结束后触发的回调列表 */
  private mouseEndCallbackTasks: ((props: { position: QN.Position }) => void)[] = []

  constructor(host: ReactiveControllerHost, options: MovementControllerOptions) {
    ;(this.host = host).addController(this)
    this.dragMouseDown = this.dragMouseDown.bind(this)
    this.target = options.target

    if (options.position) {
      this.setContainerPosition(options.position)
    }
  }

  hostConnected() {}

  hostDisconnected() {
    // 移除鼠标移动事件
    this._mouseMove && window.removeEventListener('mousemove', this._mouseMove)
  }

  /** 获取容器的位置 */
  private getContainerRect() {
    const containerRect = this.target.getBoundingClientRect()
    if (containerRect) return containerRect
  }

  /** 设置容器的位置 */
  private setContainerPosition(position: QN.Position) {
    // 容器位置 = 位置 + 偏移量
    const { left: offsetLeft, top: offsetTop } = this.offset
    const left = position.left + offsetLeft
    const top = position.top + offsetTop

    this.target.style.transform = `translate(${left}px, ${top}px)`
    return { top, left }
  }

  /** 更新偏移量 */
  updateOffset() {
    const originOffset = getOffsetByElement(this.target)
    this.offset = { top: originOffset.y, left: originOffset.x }

    return this.offset
  }

  /** 提供给外部使用的 setContainerPosition */
  setPosition(position: QN.Position) {
    const offset = this.setContainerPosition(position)
    this.offset = offset
  }

  /** 移动结束后触发回调 */
  onMoveEnd(callback: (props: { position: QN.Position }) => void) {
    this.mouseEndCallbackTasks.push(callback)
  }

  /** 鼠标按下 Drag 元素后，可进行拖动容器 */
  dragMouseDown(downEvent: MouseEvent) {
    const { x: downX, y: downY } = downEvent

    // 鼠标按下时容器的原始位置
    const originPosition = { x: downX, y: downY }
    // 容器的偏移量
    let offset = { left: 0, top: 0 }

    /** 鼠标移动时，拖动容器 */
    const mouseMove = (e: MouseEvent) => {
      const { x: mouseX, y: mouseY } = e // 鼠标的位置离
      const moveX = mouseX - originPosition.x // 鼠标移动的距离 - X
      const moveY = mouseY - originPosition.y // 鼠标移动的距离 - Y
      offset = this.setContainerPosition({ left: moveX, top: moveY })
    }

    this._mouseMove = mouseMove

    /** 鼠标抬起后， */
    const mouseUp = () => {
      window.removeEventListener('mousemove', mouseMove)
      window.removeEventListener('mouseup', mouseUp)

      this.mouseEndCallbackTasks.forEach((task) => {
        task({ position: offset })
      })

      // 设置偏移量
      this.offset = offset
    }

    // 鼠标按下后，监听鼠标移动事件, 并在鼠标抬起后移除监听
    window.addEventListener('mousemove', mouseMove)
    window.addEventListener('mouseup', mouseUp)
  }
}
