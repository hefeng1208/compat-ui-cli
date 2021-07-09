const generator = require('@babel/generator').default
const { sfcToAst } = require('./sfcToAst')
const stringifyVueAst = require('./stringify')
const { render } = require('html-formatter')

function parser(source, options) {
  const { jsAst, templateAst } = sfcToAst(source, options)
  let jsCode
  let templateCode

  if (templateAst) {
    templateCode = render(stringifyVueAst(templateAst))
  }
  if (jsAst) {
    const code = generator(jsAst).code
    jsCode = `<script>\r\n${code}\r\n</script>`
  }

  return { jsCode, templateCode }
}
module.exports = { parser }
