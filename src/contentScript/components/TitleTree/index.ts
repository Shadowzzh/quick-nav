import { LitElement, html, css, render, TemplateResult } from 'lit'
import { customElement, eventOptions, property } from 'lit/decorators.js'
import { TitleTree } from '../../interface'

import './TitleItem'

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
  rootTree: TitleTree

  constructor(options: TitleTreeElementOptions) {
    super()

    this.rootTree = options.rootTree
    this.rootTree.eachChild((child) => TitleTreeComponent.TreeMap.set(child.uniqueId, child))
  }

  /**
   * 点击标题树的某个标题时，滚动到对应的标题
   * @param e
   * @returns
   */
  onClick(e: Event) {
    const target = e.composedPath()[0] as HTMLElement
    if (!target) return

    if (target.className !== 'title') return
    const uniqueId = target.getAttribute('unique')!
    const child = TitleTreeComponent.TreeMap.get(uniqueId)

    const element = child?.data?.element

    element?.scrollIntoView()
  }

  renderTree(node: TitleTree): TemplateResult<1> {
    return html`<wc-title-item .node=${node}>
      ${node.children.map((child) => this.renderTree(child))}
    </wc-title-item>`
  }

  render() {
    return html`<div @click="${this.onClick}">
      ${this.rootTree.children.map((node) => this.renderTree(node))}
    </div>`
  }
}
