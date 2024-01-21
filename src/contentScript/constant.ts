const LowestWeights = [-100, -50, -25]

/** 最大标签深度(层) */
export const MAX_TAG_DEPTH = 12

// TODO 性能优化：每增加一级标签，计算会指数级增加
export const BASE_WEIGHTS: number[] = [
  0,
  ...Array.from({ length: MAX_TAG_DEPTH }).map((_, i) => 120 - i * 5),
]

/** 不同标签的权重 */
export const CONTENT_TAG_WEIGHT = Object.freeze({
  h1: BASE_WEIGHTS,
  h2: BASE_WEIGHTS.map((s) => s * 0.9),
  h3: BASE_WEIGHTS.map((s) => s * 0.8),
  h4: BASE_WEIGHTS.map((s) => s * 0.7),
  h5: BASE_WEIGHTS.map((s) => s * 0.6),
  h6: BASE_WEIGHTS.map((s) => s * 0.5),
  strong: BASE_WEIGHTS.map((s) => s * 0.5),
  p: BASE_WEIGHTS.map((s) => s * 0.3),
  article: [3000],
  '.article': [3000],
  '#article': [3000],
  '.content': [3000],
  '.Topstory-container': [3000], // 知乎
  sidebar: LowestWeights,
  '.sidebar': LowestWeights,
  '#sidebar': LowestWeights,
  aside: LowestWeights,
  '.aside': LowestWeights,
  '#aside': LowestWeights,
  nav: LowestWeights,
  '.nav': LowestWeights,
  '.navigation': LowestWeights,
  '.toc': LowestWeights,
  '.table-of-contents': LowestWeights,
  '.comment': LowestWeights,
})

export const TITLE_TAG_WEIGHT = Object.freeze({
  h1: 6,
  h2: 5,
  h3: 4,
  h4: 3,
  h5: 2,
  h6: 1,
})

/** 应用主题 */
export const APP_THEME = Object.freeze({
  LIGHT: 'light',
  DARK: 'dark',
})
