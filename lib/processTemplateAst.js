const componentMap = require('../shard/componentMap')
const { processComponentName } = require('../shard/helper')

function processTemplateAst(asts, source, options) {
  const {
    prefix: { before },
  } = options
  for (let astElement of asts) {
    const { children, type, tag } = astElement
    astElement = processAstLoc(astElement)
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

function processAstLoc(ast, source) {
  let { start, end } = ast.loc
  let content = ''
  if (ast.children && ast.children.length) {
    start = ast.children[0].loc.start
    end = ast.children[ast.children.length - 1].loc.end
    content = source.slice(start.offset, end.offset)
  }
  const loc = {
    source: content,
    start,
    end,
  }
  return Object.assign(
    {},
    {
      ...ast,
      loc,
    }
  )
}
module.exports = {
  processTemplateAst,
}
