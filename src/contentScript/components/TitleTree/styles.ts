import { css } from 'lit'

/** WCTitleItemStyle */
export const WCTitleItemStyle = [
  css`
    :host {
      background-color: var(--theme-background);
      font-size: 13px;
      line-height: 18px;
      position: relative;
      box-sizing: border-box;
      padding-right: 16px;
      display: block;
    }

    :host * {
      box-sizing: border-box;
    }

    :host .title {
      color: var(--theme-color);
      transition:
        0.3s background-color var(--animation-ease-out-quart),
        0.25s transform var(--animation-ease-out-quart);
      border-radius: 4px;
      cursor: pointer;
    }

    :host .title--activeChild {
      color: var(--theme-primary);
      font-weight: bold;
    }

    :host .title--active {
      color: var(--theme-selectedColor);
      background-color: var(--theme-selectedBackground);
      transform: translate(6px, -2px) scale(1, 1.05);
      position: relative;
      z-index: 2;
    }

    :host .title--active .title_background {
      transform: none !important;
    }

    :host .title--parent .title_content {
      padding-left: 0;
    }

    :host .title_inner {
      position: relative;
    }

    :host .title_content {
      position: relative;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      z-index: 2;

      padding: 6px 8px;
    }

    :host .title_content:hover {
      border-radius: 4px;
    }

    :host .title_text {
      flex: 1;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }

    :host .title_icon:hover {
      user-select: none;
    }

    :host .title_background {
      transform-origin: 100% 84%;
      transform: scale(0.7) translate(0px, 0px);

      background-color: var(--theme-item-hover-background);
      border-radius: 4px;
      bottom: 0;
      left: 0;
      opacity: 0;
      pointer-events: none;
      position: absolute;
      right: 0;
      top: 0;
      transition:
        transform 0.25s var(--animation-ease-out-circ),
        opacity 0.25s var(--animation-ease-out-circ);
      z-index: 1;
    }

    :host .title:hover .title_background {
      transform: scale(1) translate(0px, 0px);
    }
  `,
]
