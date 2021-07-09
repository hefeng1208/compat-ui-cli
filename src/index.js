const cac = require('cac')
const JoyCon = require('joycon')
const fs = require('fs-extra')
const codemod = require('./codemod')
const { logger } = require('../lib')

const cli = cac()

const joycon = new JoyCon({
  packageKey: 'jmuc',
})

joycon.addLoader({
  test: /\.jmucrc$/,
  async load(filePath) {
    const source = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(source)
  },
})

async function getConfig(flags) {
  const { path, data } = await joycon.load(['jmuc.config.js', '.jmucrc', 'package.json'])
  const config = {
    include: '**/*.vue',
    exclude: [],
    filePath: '',
    prefix: {
      before: 'jc',
      after: 'el',
      needReplaced: true,
    },
    customComponentConfig: {},
  }
  if (path) Object.assign(config, data, flags)
  Object.assign(config, flags || {})
  return config
}

cli.command('').action(() => {
  cli.outputHelp()
})

cli
  .command('upgrade', 'Processing all components')
  .option('-f, --file [file]', 'File path to be replaced')
  .example(
    `
   jmuc upgrade
   jmuc upgrade -f path-to-the-component.vue`
  )
  .allowUnknownOptions()
  .action(async ({ file }) => {
    const config = await getConfig()
    if (file) {
      if (typeof file === 'boolean') {
        logger.error(`Missing component path.\r\n`)
        cli.outputHelp()
        process.exit(-1)
      }
      config.include = file
    }
    codemod(config)
  })

cli.version(require('../package.json').version)
cli.help()

cli.parse()
