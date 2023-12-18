import { extractContent, generatorTitleTree } from './analysis'
console.time()
const content = extractContent()
if (!content) {
  console.log('未找到文章内容')
} else {
  const TitleTree = generatorTitleTree(content)
  console.log(TitleTree)
}

console.timeEnd()
