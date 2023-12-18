import { LitElement, html, css, render, TemplateResult } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('navigator-panel')
export class NavigatorPanel extends LitElement {
  static styles = [
    css`
      :host {
        z-index: 9999999;
        display: block;
        width: 300px;
        position: fixed;
        top: 0;
        right: 0;
        font-size: 13px;
        margin-top: 100px;
        background-color: #fff;
        box-shadow: rgb(0 0 0 / 7%) 0px 0px 8px 1px;
        overflow: hidden;
        border-radius: 6px;
        border: 1px solid rgb(235, 238, 245);
      }

      navigator-panel {
        background-color: red;
      }

      :host .header {
        padding: 0 10px;
        padding-top: 5px;
      }

      :host .content {
        padding: 0 10px;
        padding-bottom: 5px;
      }
    `,
  ]

  constructor() {
    super()
  }

  render() {
    return html`<div>
      <div class="header">header</div>
      <div class="content">${this.children}</div>
    </div>`
  }
}
