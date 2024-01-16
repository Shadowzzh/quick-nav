import { LitElement, html, css, TemplateResult } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { Tree } from '@/utils/models'

import { TitleTree, TitleTreeData } from '../../interface'
import './TitleItem'
import { asserts } from '@/utils'

export interface TitleTreeElementOptions {
  rootTree: TitleTree
}

@customElement('title-tree')
export class TitleTreeComponent extends LitElement {
  static styles = [
    css`
      :host {
        position: relative;
      }
    `,
  ]

  /** 标题树 */
  static TreeMap: Map<string, TitleTree> = new Map()

  /** 当前被激活的子节点 */
  static ChildActiveMap: Set<TitleTree> = new Set()

  /** 清空 Map 数据 */
  static clearMap() {
    TitleTreeComponent.TreeMap.clear()
    TitleTreeComponent.ChildActiveMap.clear()
  }

  @property({ type: Object })
  rootTree: Tree<TitleTreeData> | null = null

  /** 点击 item 触发 */
  onClickItem: ((params: { target: HTMLElement }) => void) | undefined = undefined
  /** 点击 item icon 触发 */
  onClickItemIcon: (() => void) | undefined = undefined

  constructor(options: TitleTreeElementOptions) {
    super()
  }

  connectedCallback() {
    super.connectedCallback()
  }

  /**
   * 点击展开按钮
   * @param props
   */
  private onClickExpand(props: { tree: TitleTree; isExpand: boolean }) {
    if (!props.tree.data) return

    const nextIsExpand = !props.isExpand
    const setNextIsExpand = (node?: Tree<TitleTreeData>) => {
      if (!node?.data) return
      node.data.isDisplay = nextIsExpand
      node.data.TitleItem?.requestUpdate()
    }

    props.tree.data.TitleItem?.requestUpdate()
    if (nextIsExpand === false) {
      props.tree.eachChild(setNextIsExpand)
    } else {
      props.tree.children.forEach(setNextIsExpand)
    }

    this.onClickItemIcon?.()
  }

  /**
   * 点击标题树的某个标题时，滚动到对应的标题
   * @param e
   * @returns
   */
  private onClick(e: Event) {
    let target: HTMLElement | undefined = undefined
    let ancientTargets = e.composedPath().slice() as HTMLElement[]

    while ((target = ancientTargets.shift())) {
      if (asserts.isString(target.className) === false) continue
      const classList = Array.from(target.classList)

      // 点击展开按钮
      if (classList.findIndex((v) => v === 'title_icon') !== -1) {
        const uniqueId = target.getAttribute('unique')
        if (!uniqueId) continue

        const isExpand = Boolean(Number(target.getAttribute('is_expand')))
        const child = TitleTreeComponent.TreeMap.get(uniqueId)

        child && this.onClickExpand({ tree: child, isExpand })
        break
      } else if (classList.findIndex((v) => v === 'title') !== -1) {
        // 点击标题
        const uniqueId = target.getAttribute('unique')
        if (!uniqueId) continue

        const child = TitleTreeComponent.TreeMap.get(uniqueId)
        const element = child?.data?.element

        element && this.onClickItem?.({ target: element })
        break
      }
    }
    if (!target) return
  }

  private renderTree(node: Tree<TitleTreeData>): any {
    const titleAll: TemplateResult[] = [html`<wc-title-item .node=${node}></wc-title-item>`]

    node.eachChild((child) => {
      titleAll.push(html`<wc-title-item .node=${child}></wc-title-item>`)
    })

    return titleAll
  }

  render() {
    return html`<div @click="${this.onClick}">
      ${this.rootTree?.children.map((node) => this.renderTree(node))}
    </div>`
  }
}
