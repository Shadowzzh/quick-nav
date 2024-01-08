export const $: (query: string, target?: Element) => Element[] = (
  query: string,
  target = document.body.parentElement!,
) => Array.from(target.querySelectorAll(query))

/** 获取元素的偏移量 - translate(x ,y) */
export const getTranslateByElement = (el: HTMLElement) => {
  const translate = el.style.transform
  const match = translate.match(/translate\((.+)px,(.+)px\)/) ?? []
  const originOffset = {
    x: Number(match[1] ?? 0),
    y: Number(match[2] ?? 0),
  }

  return originOffset
}

interface ScrollSmoothToProps {
  /** 滚动到的目标 */
  target: number | HTMLElement
  /** 在哪个容器中滚动 */
  container?: HTMLElement
}
/** 平滑的滚动到页面位置 */
export function scrollSmoothTo(prop: ScrollSmoothToProps) {
  let { target, container = window } = prop

  if (Array.prototype.toString.call(target).includes('HTML')) {
    target = (target as HTMLElement).offsetTop
  }
  if (typeof target !== 'number') return

  // 当前滚动高度
  let scrollTop = window.scrollY
  step(target)

  function step(position: number) {
    const distance = position - scrollTop
    scrollTop = scrollTop + distance / 6

    if (Math.abs(distance) < 1) {
      container.scrollTo({ top: position })
    } else {
      container.scrollTo({ top: scrollTop })
      requestAnimationFrame(() => step(position))
    }
  }
}
