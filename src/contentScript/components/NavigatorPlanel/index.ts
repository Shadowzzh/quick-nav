import { LitElement, html, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import { MovementController } from '../../controllers/Movement'
import { ResizeController } from '../../controllers/Resize'
import '../Icons'
import '../Button'
import '../Scrollbar'

import { syncStorage } from '../../../utils/storage'
import { QN } from '../../interface'
import { DEFAULT_CONFIG } from '../../../defaultConfig'

@customElement('navigator-panel')
export class NavigatorPanel extends LitElement {
  static styles = [
    css`
      :host {
        /* width: 300px;
        height: 400px;
        min-width: 200px;
        min-height: 200px; */
        /* top: 0;
        right: 0; */
        z-index: 9999999;
        display: block;
        position: fixed;
        font-size: 13px;
        background-color: #fff;
        box-shadow: rgb(0 0 0 / 7%) 0px 0px 8px 1px;
        overflow: hidden;
        border-radius: 6px;
        border: 1px solid rgb(235, 238, 245);
      }

      :host .quick-nav {
        height: 100%;
      }

      :host * {
        box-sizing: border-box;
      }

      :host .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        user-select: none;
      }

      /* 拖动icon */
      :host .header .header_drag {
        color: #999;
        transition: background-color 0.3s var(--animation-ease-out-quart);
      }
      :host .header .header_drag:hover {
        background-color: #f5f5f5;
      }

      :host .header .header_drag:active {
        background-color: #ebebeb;
        cursor: grab;
      }
      :host .header .header_drag wc-icon {
        transform: translate(-2px, -2px);
      }

      :host .content {
        padding-left: 10px;
        padding-bottom: 5px;
        height: calc(100% - 32px);
        width: 100%;
        /* position: relative; */
      }
    `,
  ]
  private movementController = new MovementController(this, {
    target: this,
  })
  private resizeController = new ResizeController(this, {
    target: this,
    direction: [
      'left',
      'left-bottom',
      'bottom',
      'left-top',
      'right',
      'top',
      'right-top',
      'right-bottom',
    ],
  })

  /** 是否显示组件 */
  isDisplayed: boolean = false

  constructor() {
    super()
    this.style.visibility = 'hidden'
  }

  connectedCallback() {
    super.connectedCallback()
    this.initial()
  }

  /** 初始化 */
  private async initial() {
    const { position, size } = (await syncStorage.get('navigatorPanel')) ?? {}

    // chrome.storage.sync.get((args) => console.log(args))
    // chrome.storage.sync.clear()

    /** 初始化容器信息 */
    this.style.top = `${DEFAULT_CONFIG.PANEL_X}px`
    this.style.right = `${DEFAULT_CONFIG.PANEL_Y}px`
    this.style.minHeight = `${DEFAULT_CONFIG.PANEL_MIN_WIDTH}px`
    this.style.minWidth = `${DEFAULT_CONFIG.PANEL_MIN_HEIGHT}px`

    /** 设置容器位置 */
    this.movementController.onMoveEnd(({ position }) => {
      syncStorage.set(['navigatorPanel', 'position'], position)
    })
    this.movementController.setPosition(position ?? { x: 0, y: 0 })

    /** 设置容器大小 */
    this.resizeController.onSizeEnd(({ size }) => {
      // 因为 resizeController 会修改容器的位置，所以这里需要重新更新容器的offset属性
      const offset = this.movementController.updateOffset()
      syncStorage.set(['navigatorPanel'], { size, position: offset })
    })
    this.resizeController.setSize(
      size ?? {
        width: DEFAULT_CONFIG.PANEL_WIDTH,
        height: DEFAULT_CONFIG.PANEL_HEIGHT,
      },
    )

    this.style.visibility = 'visible'
  }

  /** 双击 icon 后初始化容器矩形信息 */
  private onDblClickMoveIcon() {
    this.style.transition =
      'transform 0.3s var(--animation-ease-out-quart), width 0.3s ease-out, height 0.3s ease-out'

    const initialPosition = { x: 0, y: 0 }
    const initialSize = {
      width: DEFAULT_CONFIG.PANEL_WIDTH,
      height: DEFAULT_CONFIG.PANEL_HEIGHT,
    }

    this.movementController.setPosition(initialPosition)
    this.resizeController.setSize(initialSize)

    syncStorage.set(['navigatorPanel'], { size: initialSize, position: initialPosition })

    // TODO: 动画实现方式优化
    setTimeout(() => {
      this.style.transition = ''
    }, 300)
  }

  render() {
    return html`<div class="waves-effect quick-nav">
      <div class="header">
        <wc-button
          class="header_drag"
          @mousedown=${this.movementController.dragMouseDown}
          @dblclick=${this.onDblClickMoveIcon}
        >
          <wc-icon name="drag" size="16"></wc-icon>
        </wc-button>
        <div>Navigator</div>
      </div>
      <div class="content">
        <wc-scroll minScrollbarLength="1" suppressScrollX>${this.children}</wc-scroll>
      </div>
    </div>`
  }
}
