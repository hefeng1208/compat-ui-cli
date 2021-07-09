const componentMap = require('../shard/componentMap')
const { processComponentName } = require('../shard/helper')

function processTemplateAst(ast, options) {
  const {
    prefix: { before },
  } = options
  for (const astElement of ast) {
    const { children, type, tag } = astElement
    if (type === 1) {
      const compName = processComponentName(tag, before)
      if (componentMap[compName]) {
        componentMap[compName](astElement, 'template', options)
      }
      if (children.length) {
        processTemplateAst(children, options)
      }
    }
  }
}
module.exports = {
  processTemplateAst,
}
