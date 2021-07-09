const generator = require('@babel/generator').default
const { sfcToAst } = require('./sfcToAst')
const stringifyVueAst = require('./stringify')
const { render } = require('html-formatter')

function parser(source, options) {
  const { jsAst, templateAst, styleContent } = sfcToAst(source, options)
  let jsCode
  let templateCode

  if (templateAst) {
    templateCode = stringifyVueAst(templateAst)
  }
  if (jsAst) {
    const code = generator(jsAst).code
    jsCode = `\r\n<script>\r\n${code}\r\n</script>\r\n`
  }

  return { jsCode, templateCode, styleContent }
}
module.exports = { parser }
