export const $: (query: string, target?: Element) => Element[] = (
  query: string,
  target = document.body.parentElement!,
) => Array.from(target.querySelectorAll(query))
