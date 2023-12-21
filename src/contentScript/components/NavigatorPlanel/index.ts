import { LitElement, html, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import { MovementController } from '../../controllers/Movement'
import '../Icons'
import '../Button'

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

  private movementController = new MovementController(this, {
    target: this,
  })

  constructor() {
    super()
  }

  render() {
    return html`<div class="waves-effect">
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
