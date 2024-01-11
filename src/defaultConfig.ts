import { TitleTreeData } from './contentScript/interface'

export const DEFAULT_CONFIG = Object.freeze({
  THEME_NAME: 'quick-nav-theme',
  /** 面板宽度 */
  PANEL_WIDTH: 300,
  /** 面板高度 */
  PANEL_HEIGHT: 400,
  /** 面板最小宽度 */
  PANEL_MIN_WIDTH: 200,
  /** 面板最小高度 */
  PANEL_MIN_HEIGHT: 200,
  /** 面板位置 - Y */
  PANEL_Y: 50,
  /** 面板位置 - X */
  PANEL_X: 50,
  /** 面板最小边距 */
  PANEL_MIN_MARGIN: 10,
})

export const DEFAULT_TREE_CONFIG = Object.freeze<Partial<TitleTreeData>>({
  isDisplay: true,
  childActive: false,
  isActive: false,
})
