import { LitElement, html, css, render, TemplateResult } from 'lit'
import { customElement, eventOptions, property } from 'lit/decorators.js'
import { TitleTree } from '../../interface'
import { PointerEvent } from 'react'

export interface TitleTreeElementOptions {
  treeData: TitleTree
}

@customElement('title-tree')
export class TitleTreeComponent extends LitElement {
  static styles = [
    css`
      :host {
      }

      :host .item {
        cursor: pointer;
        color: #3b3b3b;
        padding: 3px;
      }

      :host .item:hover {
        background-color: #e6f7ff;
      }
    `,
  ]

  static TreeMap: Map<string, TitleTree> = new Map()

  @property({ type: Object })
  treeData: TitleTree

  constructor(options: TitleTreeElementOptions) {
    super()

    this.treeData = options.treeData
    this.treeData.eachChild((child) => TitleTreeComponent.TreeMap.set(child.getUniqueId, child))
  }

  /**
   * 点击标题树的某个标题时，滚动到对应的标题
   * @param e
   * @returns
   */
  onClick(e: PointerEvent<HTMLElement>) {
    const target = e.target as HTMLElement

    if (target.className !== 'item') return
    const uniqueId = target.getAttribute('unique')!
    const child = TitleTreeComponent.TreeMap.get(uniqueId)

    const element = child?.getData?.element

    element?.scrollIntoView()
  }

  structure() {
    const titleAll: TemplateResult[] = []
    console.log(this.treeData)
    this.treeData.eachChild((child) => {
      const pair = child.getData?.element

      titleAll.push(html` <div class="item" unique=${child.getUniqueId}>${pair?.innerText}</div> `)
    })

    return titleAll
  }

  render() {
    return html`<div @click="${this.onClick}">${this.structure()}</div>`
  }
}
