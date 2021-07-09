const { resolve, dirname, sep, basename } = require('path')
const fs = require('fs-extra')
const fg = require('fast-glob')
const { parser, logger } = require('../lib')

async function codemod(config) {
  let { include, exclude } = config
  if (typeof include === 'string') include = [include]
  if (typeof exclude === 'string') exclude = [exclude]

  exclude = exclude.concat('node_modules/**/*.vue')
  const files = await fg(include.concat(exclude.map((p) => `!${p}`)))

  return files.map(async (p) => {
    const abs = resolve(p)
    config.filePath = abs
    const source = await fs.readFile(abs, 'utf-8')
    try {
      const { jsCode, templateCode, styleContent } = parser(source, config)
      let renderFile = ''
      if (templateCode) {
        renderFile += `${templateCode}`
      }
      if (jsCode) {
        renderFile += jsCode
      }
      if (styleContent) {
        renderFile += styleContent
      }
      await fs.writeFile(__dirname + '/app.vue', `${renderFile}`, 'utf-8')
    } catch (e) {
      await fs.writeFile(abs, source, 'utf-8')
      logger.error(`The error occurred when processing: ${abs}`)
      logger.error(e)
    }
  })
}

module.exports = codemod
