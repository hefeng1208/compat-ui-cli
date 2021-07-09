const { processProp } = require('../lib/processProp')
const { processAttrs } = require('../lib/processAttrs')
const { compatibleComponentMap } = require('../shard/config')

function parseResult(ast, astSource, componentName, componentConfig, options) {
  const genFn = astSource === 'template' ? processProp : processAttrs
  return genFn(ast, componentName, componentConfig, options)
}

const componentObj = {}

for (const component in compatibleComponentMap) {
  componentObj[component] = function (propAst, source = 'template', options) {
    const { customComponentConfig } = options
    let componentConfig = compatibleComponentMap
    // 如果用户配置了，按用户的配置走
    if (Object.keys(customComponentConfig).length) {
      componentConfig = customComponentConfig
    }
    return parseResult(propAst, source, component, componentConfig[component], options)
  }
}

module.exports = {
  ...componentObj,
}
