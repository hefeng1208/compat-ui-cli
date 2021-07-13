function attrString(styleAttrs) {
  const buff = []
  for (const styleAttr in styleAttrs) {
    buff.push(`${styleAttr}="${styleAttrs[styleAttr]}"`)
  }
  if (!buff.length) {
    return ''
  }
  return buff.join(' ')
}
function parseStyle(styleAsts, options) {
  let styleContent = '\r\n'
  for (const styleAst of styleAsts) {
    styleContent += `<style ${styleAst.attrs ? attrString(styleAst.attrs) : ''}>${
      styleAst.content
    }</style>\r\n`
  }
  return styleContent
}

module.exports = {
  parseStyle,
}
