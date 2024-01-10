import { LitElement, html, css, render, TemplateResult, PropertyValueMap } from 'lit'
import { customElement, eventOptions, property } from 'lit/decorators.js'
import { TitleTree, TitleTreeData } from '../../interface'

import './TitleItem'
import './TitleItemSimple'
import { Tree } from '../../../utils/models/Tree'
import { scrollSmoothTo } from '../../../utils'

export interface TitleTreeElementOptions {
  rootTree: TitleTree
}

@customElement('title-tree')
export class TitleTreeComponent extends LitElement {
  static styles = [
    css`
      :host {
      }
    `,
  ]

  static TreeMap: Map<string, TitleTree> = new Map()

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
  private onClickExpand(props: { tree: TitleTree }) {
    if (!props.tree.data) return

    props.tree.data.TitleItem?.requestUpdate()
    props.tree.eachChild((child) => {
      if (!child.data) return
      child.data.isDisplay = !child.data.isDisplay
      child.data.TitleItem?.requestUpdate()
    })

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
      const className = target.className as 'title_icon' | 'title_content'

      switch (className) {
      }

      if (className === 'title_icon') {
        const uniqueId = target.getAttribute('unique')
        if (!uniqueId) continue

        const child = TitleTreeComponent.TreeMap.get(uniqueId)

        child && this.onClickExpand({ tree: child })
        break
      } else if (className === 'title_content') {
        const uniqueId = target.getAttribute('unique')
        if (!uniqueId) continue
        const child = TitleTreeComponent.TreeMap.get(uniqueId)

        const element = child?.data?.element
        if (!element) return

        this.onClickItem?.({ target: element })

        break
      }
    }
    if (!target) return
  }

  private renderTree(node: Tree<TitleTreeData>): any {
    // return html`<wc-title-item .node=${node}>
    //   ${node.children.map((child) => {
    //     return this.renderTree(child)
    //   })}
    // </wc-title-item>`
    const titleAll: TemplateResult[] = [
      html`<wc-title-item-simple .node=${node}></wc-title-item-simple>`,
    ]

    node.eachChild((child) => {
      titleAll.push(html`<wc-title-item-simple .node=${child}></wc-title-item-simple>`)
    })
    return titleAll
  }

  render() {
    return html`<div @click="${this.onClick}">
      ${this.rootTree?.children.map((node) => this.renderTree(node))}
    </div>`
  }
}
