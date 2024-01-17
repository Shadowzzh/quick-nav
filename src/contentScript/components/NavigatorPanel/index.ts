import { LitElement, html, css, TemplateResult } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { MovementController } from '../../controllers/Movement'
import { Direction, ResizeController } from '../../controllers/Resize'
import { syncStorage } from '../../../utils/storage'
import { DEFAULT_CONFIG } from '../../../defaultConfig'
import { Ref, createRef, ref } from 'lit/directives/ref.js'
import { WCScroll } from '../Scrollbar'
import '../Icons'
import '../Button'
import '../Scrollbar'

@customElement('wc-navigator-panel')
export class WCNavigatorPanel extends LitElement {
  static styles = [
    css`
      :host {
        box-sizing: border-box;
        z-index: 9998;
        display: block;
        position: fixed;
      }

      :host .quick-nav {
        height: 100%;

        background-color: var(--theme-background);
        box-shadow: var(--theme-shadow);
        overflow: hidden;
        border-radius: 6px;

        transition: opacity 0.5s var(--animation-ease-out-quart);
      }

      :host .quick-nav:hover {
        opacity: 1;
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
      /* :host .header .header_icon {
      } */
      /* place */
      :host .header .header_space {
        flex: auto;
      }
      :host .header .header_drag {
        cursor: grab;
        transition: background-color 0.3s var(--animation-ease-out-quart);
      }
      :host .header .header_drag:active {
        cursor: grabbing;
      }

      :host .header .header_drag wc-icon {
        transform: translate(-2px, -2px);
      }

      :host .content {
        padding-left: 10px;
        padding-bottom: 5px;
        height: calc(100% - 32px);
        width: 100%;
        position: relative;
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
    onDblClick: (direction, downEvent) => this.onDblClickResizeController(direction, downEvent),
  })

  scrollRef: Ref<WCScroll> = createRef()

  /** 扩展的 Icon */
  @property({ type: Array })
  extraIcon: TemplateResult<1>[] | null = null

  constructor() {
    super()
    this.style.visibility = 'hidden'
  }

  protected firstUpdated() {
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
  private initializationPosition() {
    this.style.transition =
      'transform 0.3s var(--animation-ease-out-quart), width 0.3s ease-out, height 0.3s ease-out'
    const initialPosition = { x: 0, y: 0 }
    const initialSize = {
      width: DEFAULT_CONFIG.PANEL_WIDTH,
      height: DEFAULT_CONFIG.PANEL_HEIGHT,
    }

    this.movementController.offset = initialPosition
    this.movementController.setPosition(initialPosition)
    this.resizeController.setSize(initialSize)

    syncStorage.set(['navigatorPanel'], { size: initialSize, position: initialPosition })

    // TODO: 动画实现方式优化
    setTimeout(() => {
      this.style.transition = ''
    }, 300)
  }

  /** 双击后设置最大高度 */
  private async onDblClickResizeController(direction: Direction, _: MouseEvent) {
    this.style.transition =
      'transform 0.3s var(--animation-ease-out-quart), width 0.3s ease-out, height 0.3s ease-out'

    if (['top', 'bottom'].includes(direction)) {
      const initialPositionY = -DEFAULT_CONFIG.PANEL_Y + DEFAULT_CONFIG.PANEL_MIN_MARGIN

      this.movementController.offset.y = 0
      this.movementController.setPosition({ y: initialPositionY })
      this.resizeController.setSizeSafe({ height: Number.MAX_SAFE_INTEGER })
    }

    // TODO: 动画实现方式优化
    await new Promise((resolve) => setTimeout(resolve, 250))
    this.style.transition = ''

    const offset = this.movementController.offset
    const size = this.resizeController.getSize()

    syncStorage.set(['navigatorPanel'], { size, position: offset })
  }

  /** 获取 scroll 实例 */
  getScrollInstance() {
    return this.scrollRef.value
  }

  /** 更新 scroll 视图 */
  scrollUpdate() {
    this.scrollRef.value?.updateScroll()
  }

  render() {
    return html`<div class="waves-effect quick-nav">
      <div class="header">
        <wc-button
          size="normal"
          class="header_drag"
          icon="drag"
          iconSize="16"
          iconColor="var(--theme-icon)"
          @mousedown=${this.movementController.dragMouseDown}
          @dblclick=${this.initializationPosition}
        >
        </wc-button>
        <div class="header_space"></div>
        <slot name="extraIcon"></slot>
      </div>

      <div class="content">
        <wc-scroll ref=${ref(this.scrollRef)} minScrollbarLength="1" suppressScrollX>
          <slot></slot>
        </wc-scroll>
      </div>
    </div>`
  }
}
