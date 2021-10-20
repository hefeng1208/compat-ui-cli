const { parse: vueParse } = require('@vue/compiler-sfc')
const { parse: babelParse } = require('@babel/parser')
const { processTemplateAst } = require('./processTemplateAst')
const { parseJavascript } = require('./parseJavascript')
const { parseStyle } = require('./parseStyle')

function sfcToAst(source, options) {
  const {
    descriptor: { script, template, styles = [], customBlocks },
  } = vueParse(source)

  let templateAst
  let jsAst
  let styleContent
  if (template) {
    const { ast } = template
    if (ast.tag === 'template') {
      processTemplateAst(ast.children, options)
    }
    templateAst = ast
  }
  if (script && script.content) {
    jsAst = babelParse(script.content, {
      sourceType: 'module',
      plugins: [
        'objectRestSpread',
        'dynamicImport',
        'decorators-legacy',
        'classProperties',
        'typescript',
        'jsx',
      ],
    })
    parseJavascript(jsAst, options)
  }
  if (styles && styles.length > 0) {
    styleContent = parseStyle(styles)
  }
  return {
    templateAst,
    jsAst,
    styleContent,
    customBlocks,
  }
}
module.exports = { sfcToAst }
