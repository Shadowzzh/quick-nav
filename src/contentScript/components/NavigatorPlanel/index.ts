import { LitElement, html, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import { MovementController } from '../../controllers/Movement'
import { ResizeController } from '../../controllers/Resize'
import '../Icons'
import '../Button'

@customElement('navigator-panel')
export class NavigatorPanel extends LitElement {
  static styles = [
    css`
      :host {
        width: 300px;
        height: 400px;
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
        padding: 0 10px;
        padding-bottom: 5px;
        height: calc(100% - 32px);

        overflow: auto;
      }
    `,
  ]

  private movementController = new MovementController(this, {
    target: this,
  })
  private resizeController = new ResizeController(this, {
    target: this,
    direction: ['left', 'bottom', 'left-bottom'],
  })

  constructor() {
    super()
  }

  render() {
    return html`<div class="waves-effect quick-nav">
      <div class="header">
        <wc-button class="header_drag" @mousedown=${this.movementController.dragMouseDown}>
          <wc-icon name="drag" size="16"></wc-icon>
        </wc-button>
        <div>Navigator</div>
      </div>
      <div class="content">${this.children}</div>
    </div>`
  }
}
