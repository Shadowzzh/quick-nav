import type { Tree } from '../utils/models/Tree'
import { WCTitleItem } from './components/TitleTree/TitleItem'
import { WCTitleItemSimple } from './components/TitleTree/TitleItemSimple'

export type TitleTreeData = {
  /** node 对应的元素 */
  element: HTMLElement
  /** 是否显示 */
  isDisplay: boolean
  /** node 对应的组件 */
  TitleItem?: WCTitleItem | WCTitleItemSimple
  /** 是否为活动状态 */
  isActive: boolean
  /** 子元素是否为活动状态 */
  childActive: boolean
}

/** 标题 Tree */
export type TitleTree = Tree<TitleTreeData>

namespace QN {
  export interface Position {
    y: number
    x: number
  }

  export interface Size {
    width: number
    height: number
  }
}
