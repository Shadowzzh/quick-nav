const LowestWeights = [-100, -50, -25]
// TODO 性能优化：每增加一级标签，计算会指数级增加
const baseWeights = [0, 100, 90, 80, 70, 60, 50, 40, 30]

/** 不同标签的权重 */
export const CONTENT_TAG_WEIGHT = Object.freeze({
  h1: baseWeights,
  h2: baseWeights.map((s) => s * 0.9),
  h3: baseWeights.map((s) => s * 0.8),
  h4: baseWeights.map((s) => s * 0.7),
  h5: baseWeights.map((s) => s * 0.6),
  h6: baseWeights.map((s) => s * 0.5),
  strong: baseWeights.map((s) => s * 0.5),
  p: baseWeights.map((s) => s * 0.3),
  article: [500],
  '.article': [500],
  '#article': [500],
  '.content': [250],
  // Secondary content areas should generally have a low weight
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

/** 不同 header 标签的权重 */
// export const TITLE_TAG_WEIGHT = Object.freeze({
//   h1: 1,
//   h2: 2,
//   h3: 3,
//   h4: 4,
//   h5: 5,
//   h6: 6,
//   // strong: 7,
// })

export const TITLE_TAG_WEIGHT = Object.freeze({
  h1: 6,
  h2: 5,
  h3: 4,
  h4: 3,
  h5: 2,
  h6: 1,
  // strong: 0,
})
