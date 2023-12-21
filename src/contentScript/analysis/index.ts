import { $ } from '../../utils'
import { Tree } from '../../utils/models/Tree'
import { CONTENT_TAG_WEIGHT, TITLE_TAG_WEIGHT } from '../constant'
import type { TitleTree, TitleTreeData } from '../interface'

/**
 * 追溯并返回指定元素的祖先元素列表。
 *
 * @param element - 起始元素，将从该元素开始追溯其祖先元素。
 * @param tier - 需要追溯的层级数。例如，tier为 1 意味着只追溯直接父元素，tier为 2 则追溯父元素及其父元素，依此类推。
 * @param callback -（可选）一个回调函数，将在遍历每个祖先元素时调用。提供了两个参数：
 *    - ancestor: 当前正在处理的祖先元素。
 *    - depth: 当前祖先元素的深度，从 0 开始计数。
 *
 * @returns 一个包含从起始元素向上的祖先元素的数组，数组中的第一个元素是最近的祖先，依次向上。
 */
function traceAncestor(
  element: Element,
  tier: number,
  callback?: (ancestor: Element, depth: number) => void,
) {
  let current: Element | null = element
  let depth = 0

  const ancestor = []

  // 循环直到达到指定层级或没有更多祖先元素
  while (tier-- > 0 && current !== null) {
    callback?.(current, depth++)
    ancestor.push(current)

    current = current.parentElement
  }

  return ancestor
}

/** 判断元素是否为空 */
function elementIsEmpty(element: HTMLElement) {
  return element.innerText.trim() === '' || element.innerText === undefined
}

/** 获取 element 标签对应的权重 */
function getWeightByElement(tag: Element | undefined) {
  if (!tag) return -1
  const tagName = tag.tagName.toLowerCase() as keyof typeof TITLE_TAG_WEIGHT
  return TITLE_TAG_WEIGHT[tagName]
}

/** 提取文章内容 */
export function extractContent() {
  /** 元素 => 权重的映射 */
  const contentWeight = new Map<Element, number>()
  const contentTags = Object.keys(CONTENT_TAG_WEIGHT)

  contentTags.forEach((tag) => {
    const contentsOfTag = $(tag)
    if (contentsOfTag.length === 0) return

    const weightsOfTag = CONTENT_TAG_WEIGHT[tag as keyof typeof CONTENT_TAG_WEIGHT]

    contentsOfTag.forEach((content) => {
      traceAncestor(content, weightsOfTag.length, (ancestor, depth) => {
        const currentWeight = contentWeight.get(ancestor) ?? 0
        contentWeight.set(ancestor, currentWeight + weightsOfTag[depth])
      })
    })
  })

  if (contentWeight.size <= 0) {
    return undefined
  }

  const sortedByWeight = [...contentWeight].sort((a, b) => b[1] - a[1])[0]
  const [article] = sortedByWeight

  return article
}

/**
 * 根据文章内容生成标题 Tree
 * 把所有的标题根据权重生成一标题树，树的根节点是权重最大的标题
 */
export function generatorTitleTree(content: Element) {
  const titleTags = Object.keys(TITLE_TAG_WEIGHT)
  /** 文章中所有的标题元素 */
  const titlesOfTag = $(titleTags.join(','), content) as HTMLElement[]

  // 如果文章中没有标题，则返回 undefined
  if (titlesOfTag.length === 0) {
    return undefined
  }

  // 预先计算所有标题的权重
  const titleWeights = new Map<HTMLElement, number>(
    titlesOfTag.map((title) => [title, getWeightByElement(title)]),
  )

  /** 根节点 */
  const rootTree = new Tree<TitleTreeData>()
  /** 前一个标题的 Tree */
  let preTree: TitleTree = new Tree({ data: { element: titlesOfTag[0] } })
  if (elementIsEmpty(preTree.getData!.element)) return

  rootTree.appendChild(preTree)

  for (let i = 1; i < titlesOfTag.length; i++) {
    const title = titlesOfTag[i]
    const weight = titleWeights.get(title)!
    const preTitle = preTree.getData!.element

    // 如果标题没有内容，则跳过
    if (elementIsEmpty(title)) continue

    const currentTree = new Tree<TitleTreeData>({ data: { element: title } })

    // 如果当前标题的权重小于于前一个标题的权重, 则将当前标题添加到前一个标题的子节点中
    if (weight < titleWeights.get(preTitle)!) {
      preTree.appendChild(currentTree)
    } else {
      let ancestor: TitleTree | undefined = preTree

      while ((ancestor = ancestor?.getParent)) {
        // 根节点权重默认最大，所以不需要判断，直接添加到根节点中
        if (ancestor.isRoot()) {
          ancestor.getRoot.appendChild(currentTree)
          break
        }

        // 向上查找第一个权重大于当前标题权重的标题，将当前标题添加到该标题的子节点中
        if (weight < titleWeights.get(ancestor.getData!.element)!) {
          ancestor.appendChild(currentTree)
          break
        }
      }
    }

    preTree = currentTree
  }

  if (rootTree.getChildren.length === 0) return undefined

  return rootTree
}
