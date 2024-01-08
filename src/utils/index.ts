export const $: (query: string, target?: HTMLElement) => HTMLElement[] = (
  query: string,
  target = document.body.parentElement!,
) => Array.from(target.querySelectorAll(query))

/**
 * 判断{@link v}值的类型，具有·类型收窄·功能
 * @param v 任意值
 */
export const asserts = (() => {
  const isObject = (v: any): v is object => v instanceof Object
  const isString = (v: any): v is string => typeof v === 'string'
  const isNumber = (v: any): v is number => typeof v === 'number'
  const isBoolean = (v: any): v is boolean => typeof v === 'boolean'
  const isBigint = (v: any): v is bigint => typeof v === 'bigint'
  const isSymbol = (v: any): v is symbol => typeof v === 'symbol'

  const isArray = <T extends any[]>(v: any): v is T => v instanceof Array
  const isBlob = (v: any): v is Blob => v instanceof Blob
  const isDate = (v: any): v is Date => v instanceof Date
  const isFile = (v: any): v is File => v instanceof File
  const isFormdata = (v: any): v is FormData => v instanceof FormData
  const isPromise = <T extends any>(v: any): v is Promise<T> => v instanceof Promise
  const isFunction = <T extends (...args: any) => any>(v: any): v is T => v instanceof Function

  const isHTMLElement = (v: any): v is HTMLElement => v instanceof HTMLElement

  const isUndefined = (v: any): v is undefined => v === undefined
  const isNull = (v: any): v is null => v === null

  return {
    isHTMLElement,
    isObject,
    isString,
    isNumber,
    isBoolean,
    isUndefined,
    isFunction,
    isBigint,
    isSymbol,
    isNull,
    isArray,
    isBlob,
    isDate,
    isFile,
    isFormdata,
    isPromise,
  }
})()

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
  container?: HTMLElement | Window
}
/** 平滑的滚动到页面位置 */
export function scrollSmoothTo(prop: ScrollSmoothToProps) {
  let { target, container = window } = prop

  if (asserts.isHTMLElement(target)) {
    target = target.offsetTop
  }
  if (typeof target !== 'number') return

  // 当前滚动高度
  let scrollTop = asserts.isHTMLElement(container) ? container.scrollTop : container.screenY
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
