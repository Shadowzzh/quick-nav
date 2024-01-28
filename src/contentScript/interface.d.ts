import type { Tree } from '../utils/models/Tree'
import type { WCTitleItem } from './components/TitleTree/TitleItem'

export type TitleTreeData = {
  /** node 对应的元素 */
  element: HTMLElement
  /** 是否显示 */
  isDisplay: boolean
  /** node 对应的组件 */
  TitleItem?: WCTitleItem
  /** 是否为活动状态 */
  isActive: boolean
  /** 子元素是否为活动状态 */
  childActive: boolean
  /** 是否被销毁 */
  isDestroyed?: boolean
}

/** 标题 Tree */
export type TitleTree = Tree<TitleTreeData>

/** 应用相关的全局类型 */
namespace QN {
  export type Theme = 'light' | 'dark'
  export interface Position {
    y: number
    x: number
  }

  export interface Size {
    width: number
    height: number
  }
}

/** 通讯消息 */
export namespace PlatformMessage {
  /** 通讯消息类型 */
  export type Type = 'open-qn' | 'close-qn'

  /** 通讯消息 */
  export interface Data<T = any> {
    /** 通讯消息类型 */
    type: Type
    /** 消息内容 */
    content?: T
  }
}
