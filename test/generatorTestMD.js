import fs from 'fs'
import path from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const generatorDMFile = (name, content) => {
  fs.writeFile(path.resolve(__dirname, `${name}.md`), content, (err) => {
    if (err) {
      console.log(err)
    }
  })
}

const mdData = (() => {
  let content = ''
  for (let i = 1; i <= 6; i++) {
    for (let j = 0; j < i; j++) {
      const tag = `<h${i}>${i}级标题</h${i}> \n`
      content += tag
    }
  }
  return content
})()
console.log(mdData)
generatorDMFile('test', mdData)
