import type { Tree } from '../utils/models/Tree'
import { WCTitleItem } from './components/TitleTree/TitleItem'
import { WCTitleItemSimple } from './components/TitleTree/TitleItemSimple'

export type TitleTreeData = {
  element: HTMLElement
  isDisplay: boolean
  TitleItem: undefined | WCTitleItem | WCTitleItemSimple
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
