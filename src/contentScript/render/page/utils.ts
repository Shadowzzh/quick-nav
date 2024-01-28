import { getOffsetTopElement, getScrollElement } from '@/contentScript/analysis'
import { getThemeColorOption } from '@/contentScript/styles/mixins'
import { mergeStyle } from '../../analysis/index'
import { GET_SCROLL_MARGIN } from '@/contentScript/constant'
import { scrollSmoothTo } from '@/utils'

class ClareBg {
  container: HTMLElement
  option: {
    width: number
    height: number
    top: number
    left: number
  }
  dom: HTMLElement | null = null
  constructor(container: HTMLElement, option: ClareBg['option']) {
    this.container = container
    this.option = option
  }

  create() {
    const { width, height, top, left } = this.option
    const glareDom = document.createElement('div')

    mergeStyle(glareDom.style, {
      position: 'absolute',
      top: `${top}px`,
      left: `${left}px`,
      width: `${width}px`,
      height: `${height}px`,
      display: `block`,
      zIndex: '1',
      borderRadius: '4px',
    })

    this.container.appendChild(glareDom)
    this.dom = glareDom

    return glareDom
  }

  destroy() {
    this.dom && this.container.removeChild(this.dom)
  }
}

/** 背景闪光的元素集合 */
const glareSet = new Set<HTMLElement>()

/**
 * 设置背景闪光
 * @param params
 */
export const setBackgroundGlare = async (params: {
  /** 目标元素 */
  target: HTMLElement
  /** 动画时长 */
  duration?: number
  /** 缓动函数 */
  easing?: string
}) => {
  const { duration = 800, easing = 'ease', target } = params

  // 如果已经存在，则不再创建
  if (glareSet.has(target)) return

  /** 获取主题颜色 */
  const themeColorOption = await getThemeColorOption()
  // 获取目标元素的位置信息
  const targetRect = target.getBoundingClientRect()
  // 获取目标元素的偏移量
  const targetOffsetTop = getOffsetTopElement(target)
  const container = getScrollElement(target)

  const GlareBg = new ClareBg(container, {
    width: targetRect.width,
    height: targetRect.height,
    top: targetOffsetTop,
    left: targetRect.left,
  })

  const glareDom = GlareBg.create()

  const startStyle = {
    transform: 'scale(1, 1)',
    backgroundColor: 'transparent',
    opacity: 0,
  }
  const endStyle = {
    transform: 'scale(1.05, 1.5)',
    backgroundColor: themeColorOption.selectedBackground,
    opacity: 0.7,
  }

  glareSet.add(target)

  // 进入动画
  const animateIn = glareDom.animate([startStyle, endStyle], { duration, easing })
  await animateIn.finished

  // 离开动画
  const animateOut = glareDom.animate([endStyle, startStyle], { duration, easing })
  await animateOut.finished

  glareSet.delete(target)
  GlareBg.destroy()
}

/**
 * 平滑的滚动到页面位置
 **/
export const scrollSmoothToByPage = (params: {
  /** 滚动到的目标 */
  target: HTMLElement
  /** 在哪个容器中滚动 */
  container?: HTMLElement | Window
}) => {
  const targetTop = getOffsetTopElement(params.target) - GET_SCROLL_MARGIN()
  scrollSmoothTo({ target: targetTop, container: params.container })
}
