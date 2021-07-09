module.exports = {
  parseStyle(styleAsts, options) {
    let styleContent = '\r\n'
    for (const styleAst of styleAsts) {
      styleContent += `<style>${styleAst.content}</style>\r\n`
    }
    return styleContent
  },
}
