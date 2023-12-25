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
