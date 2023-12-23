import { LitElement, html, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import { MovementController } from '../../controllers/Movement'
import { ResizeController } from '../../controllers/Resize'
import '../Icons'
import '../Button'
import '../Scrollbar'

import { syncStorage } from '../../../utils/storage'
import { QN } from '../../interface'

@customElement('navigator-panel')
export class NavigatorPanel extends LitElement {
  static styles = [
    css`
      :host {
        width: 300px;
        height: 400px;
        min-width: 200px;
        min-height: 200px;
        z-index: 9999999;
        display: block;
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
  async initial() {
    const { position, size } = (await syncStorage.get('navigatorPanel')) ?? {}

    // 设置容器位置
    if (position) {
      this.movementController.onMoveEnd(({ position }) => {
        syncStorage.set(['navigatorPanel', 'position'], position)
      })

      this.movementController.setPosition(position)
    }

    // 设置容器大小
    if (size) {
      this.resizeController.onSizeEnd(({ size }) => {
        // 因为 resizeController 会修改容器的位置，所以这里需要重新更新容器的offset属性
        const offset = this.movementController.updateOffset()
        syncStorage.set(['navigatorPanel'], { size, position: offset })
      })
      this.resizeController.setSize(size)
    }

    this.style.visibility = 'visible'
  }

  render() {
    return html`<div class="waves-effect quick-nav">
      <div class="header">
        <wc-button class="header_drag" @mousedown=${this.movementController.dragMouseDown}>
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
