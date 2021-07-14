const { sfcToAst } = require('./sfcToAst')
const stringifyVueAst = require('./stringify')

function parser(source, options) {
  const { descriptor } = sfcToAst(source, options)
  return stringifyVueAst(descriptor)
}
module.exports = { parser }
