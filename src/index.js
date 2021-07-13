const cac = require('cac')
const shell = require('shelljs')
const ora = require('ora')
const JoyCon = require('joycon')
const fs = require('fs-extra')
const codemod = require('./codemod')
const { logger } = require('../lib')

const cli = cac()

const joycon = new JoyCon({
  packageKey: 'jmuc',
})

let spinner

joycon.addLoader({
  test: /\.jmucrc$/,
  async load(filePath) {
    const source = await fs.readFile(filePath, 'utf-8')
    return source
  },
})

async function getConfig(flags) {
  const { path, data } = await joycon.load(['jmuc.config.js', '.jmucrc', 'package.json'])
  const config = {
    include: '**/*.vue',
    exclude: ['**/node_modules'],
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
  .action(async ({ file }, flags) => {
    const config = await getConfig(flags)
    if (file) {
      if (typeof file === 'boolean') {
        logger.error(`Missing component path.\r\n`)
        cli.outputHelp()
        process.exit(-1)
      }
      config.include = file
    }
    await codemod(config)

    await lint()
    logger.success('Generated successfully')
  })

cli.version(require('../package.json').version)
cli.help()

cli.parse()

function lint() {
  const arg = '. --fix --ext .js,.vue'
  spinner = ora('Start eslinting...').start()

  if (shell.which('eslint')) {
    const eslint = shell.which('eslint').stdout
    shell.exec(`${eslint} . --fix --ext .js,.vue`)
  } else {
    shell.exec(`npx eslint ${arg}`)
  }
  spinner.succeed('Done')
}
