import { LitElement, html, css, render, TemplateResult } from 'lit'
import { customElement, eventOptions, property } from 'lit/decorators.js'
import { TitleTree, TitleTreeData } from '../../interface'

import './TitleItem'
import './TitleItemSimple'
import { Tree } from '../../../utils/models/Tree'

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
  rootTree: TitleTree | null = null

  constructor(options: TitleTreeElementOptions) {
    super()
  }

  connectedCallback() {
    super.connectedCallback()
    this.rootTree?.eachChild((child) => TitleTreeComponent.TreeMap.set(child.uniqueId, child))
  }

  /**
   * 点击展开按钮
   * @param props
   */
  onClickExpand(props: { tree: TitleTree }) {
    if (!props.tree.data) return

    props.tree.data.TitleItem?.requestUpdate()
    props.tree.eachChild((child) => {
      if (!child.data) return
      child.data.isDisplay = !child.data.isDisplay
      child.data.TitleItem?.requestUpdate()
    })
  }

  /**
   * 点击标题树的某个标题时，滚动到对应的标题
   * @param e
   * @returns
   */
  onClick(e: Event) {
    let target: HTMLElement | undefined = undefined
    let ancientTargets = e.composedPath().slice() as HTMLElement[]

    while ((target = ancientTargets.shift())) {
      const className = target.className

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
        element?.scrollIntoView()
        break
      }
    }
    if (!target) return
  }

  renderTree(node: Tree<TitleTreeData>): any {
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
