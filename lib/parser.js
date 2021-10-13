const generator = require('@babel/generator').default
const { sfcToAst } = require('./sfcToAst')
const stringifyVueAst = require('./stringify')

function parser(source, options) {
  const { jsAst, templateAst, styleContent, customBlocks } = sfcToAst(source, options)
  let jsCode
  let templateCode
  let customBlock = ''

  if (templateAst) {
    templateCode = stringifyVueAst(templateAst, options)
  }
  if (jsAst) {
    const code = generator(jsAst).code
    jsCode = `\r\n<script>\r\n${code}\r\n</script>\r\n`
  }

  if (customBlocks) {
    for (const block of customBlocks) {
      const { type, attrs } = block
      const attrStr = Object.keys(attrs).reduce((acc, cur) => {
        acc += ` ${cur}="${attrs[cur]}"`
        return acc
      }, '')
      customBlock += `\r\n<${type}${attrStr}>${block.content}</${type}>`
    }
  }

  return { jsCode, templateCode, styleContent, customBlock }
}
module.exports = { parser }
