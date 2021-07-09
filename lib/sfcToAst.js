const { parse: vueParse } = require('@vue/compiler-sfc')
const { parse: babelParse } = require('@babel/parser')
const { processTemplateAst } = require('./processTemplateAst')
const { parseJavascript } = require('./parseJavascript')

function sfcToAst(source, options) {
  const {
    descriptor: { script, template },
  } = vueParse(source)

  let templateAst
  let jsAst

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

  return {
    templateAst,
    jsAst,
  }
}
module.exports = { sfcToAst }
