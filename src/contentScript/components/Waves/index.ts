import { LitElement, css } from 'lit'
import { customElement } from 'lit/decorators.js'

export interface WCWavesOptions {}

@customElement('wec-waves')
export class WCWaves extends LitElement {
  static styles = [
    css`
      .waves-effect {
        position: relative;
        display: inline-block;
        overflow: hidden;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
        vertical-align: middle;
        z-index: 1;
        transition: 0.3s ease-out;
      }

      img {
        position: relative;
        z-index: -1;
      }
      .waves-effect.waves-light .waves-ripple {
        background-color: rgba(255, 255, 255, 0.45);
      }
      .waves-effect.waves-red .waves-ripple {
        background-color: rgba(244, 67, 54, 0.7);
      }
      .waves-effect.waves-yellow .waves-ripple {
        background-color: rgba(255, 235, 59, 0.7);
      }
      .waves-effect.waves-orange .waves-ripple {
        background-color: rgba(255, 152, 0, 0.7);
      }
      .waves-effect.waves-purple .waves-ripple {
        background-color: rgba(156, 39, 176, 0.7);
      }
      .waves-effect.waves-green .waves-ripple {
        background-color: rgba(76, 175, 80, 0.7);
      }
      .waves-effect.waves-teal .waves-ripple {
        background-color: rgba(0, 150, 136, 0.7);
      }

      .waves-ripple {
        position: absolute;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        margin-top: -10px;
        margin-left: -10px;
        opacity: 0;

        background: var(--theme-waves-background);
        transition: all 0.7s ease-out;
        transition-property: transform, opacity;
        transform: scale(0);
        pointer-events: none;
      }

      input[type='button'],
      input[type='reset'],
      input[type='submit'] {
        border: 0;
        font-style: normal;
        font-size: inherit;
        text-transform: inherit;
        background: none;
      }

      .waves-notransition {
        transition: none !important;
      }

      .waves-circle {
        transform: translateZ(0);
        -webkit-mask-image: -webkit-radial-gradient(circle, white 100%, black 100%);
      }

      .waves-input-wrapper {
        border-radius: 0.2em;
        vertical-align: bottom;
      }

      .waves-button-input {
        position: relative;
        top: 0;
        left: 0;
        z-index: 1;
      }

      .waves-circle {
        text-align: center;
        width: 2.5em;
        height: 2.5em;
        line-height: 2.5em;
        border-radius: 50%;
        -webkit-mask-image: none;
      }

      .waves-block {
        display: block;
      }

      /* Firefox Bug: link not triggered */
      .waves-effect .waves-ripple {
        z-index: -1;
      }
    `,
  ]

  constructor() {
    super()
  }
}
