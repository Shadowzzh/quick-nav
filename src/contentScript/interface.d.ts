import type { Tree } from '../utils/models/Tree'

export type TitleTreeData = { element: HTMLElement }
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
