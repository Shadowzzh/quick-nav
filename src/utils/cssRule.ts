import { $ } from '.'

export const cssRule = (function () {
  /** css表 */
  let caSheet: CSSStyleSheet | null
  /** css规则 */
  let caRules: CSSRuleList

  const style = document.createElement('style')
  $('head')[0].appendChild(style)

  caSheet = style.sheet!
  caRules = caSheet.cssRules ?? []

  return {
    /**
     * 给 caSheet添加 caRule规则
     * @param  name 规则名称
     * @param  content 规则内容
     */
    add(name: string, content: string) {
      if (!caSheet) return
      //  插入sheet中的位置
      const rulesLen = caRules.length
      if (caSheet.insertRule) {
        caSheet.insertRule(`${name}{${content}}`, rulesLen)
      }
    },

    /**
     * 获取 caRules中的css规则
     * @param  name 规则名称
     */
    get(name: string) {
      for (const index of Object.keys(caRules)) {
        const rule = caRules[index as keyof typeof caRules] as CSSStyleRule

        if (rule.constructor.name === 'CSSStyleRule' && rule.selectorText === name) {
          return { rule, index: Number(index) }
        }
      }
    },

    /**
     * 删除 caRules中的一个规则
     * @param  name
     */
    remove(name: string) {
      const ruleObj = cssRule.get(name)
      if (!ruleObj || !caSheet) return

      if (caSheet.deleteRule) {
        caSheet.deleteRule(ruleObj.index)
      }
    },
  }
})()
