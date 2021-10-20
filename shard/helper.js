const Log = require('log-horizon')
const camelCase = require('camelcase')
const kebabCase = require('kebab-case')
const { compatibleComponents } = require('../shard/config')

const logger = Log.create()

/**
 * 将目标变成驼峰
 * @param target
 * @param options: {pascalCase: false}，支持大驼峰，默认小驼峰
 * @returns {string|*}
 */
function camelCaseForTarget(target, options) {
  if (typeof target === 'string') {
    return camelCase(target, options)
  }
  if (Array.isArray(target)) {
    return target.map((item) => camelCase(item, options))
  }
}

/**
 * 将目标转成KebabCase "中横线连字符"格式
 * @param target
 * @returns {*}
 */
function kebabCaseForTarget(target) {
  if (typeof target === 'string') {
    return kebabCase(target)
  }
  if (Array.isArray(target)) {
    return target.map((item) => kebabCase(item))
  }
}

const curry = (fn) =>
  // eslint-disable-next-line no-undef
  (judge = (...args) => (args.length === fn.length ? fn(...args) : (arg) => judge(...args, arg)))

/**
 * 将所有jc组件组件处理成，大驼峰或者"中横线连字符"格式
 * eg: ==> jc-button| JcButton
 */
function processComponent() {
  // 配置中，默认组件名为大驼峰
  const componentsPascalCase = camelCaseForTarget([...compatibleComponents])
  // 将组件转成KebabCase "中横线连字符"格式
  const componentKebabCase = kebabCaseForTarget(componentsPascalCase)
  return [...componentKebabCase, ...componentsPascalCase].join('|')
}

function processComponentName(tag, prefix) {
  const allComponents = processComponent()
  const regTag = new RegExp(`(?<=(${prefix}))[-]*(?<compName>${allComponents})`, `i`)

  const args = tag.match(regTag)
  // 取分组名
  if (args && args.slice(-1)) {
    return camelCaseForTarget(args.slice(-1)[0], { pascalCase: true })
  }
  return ''
}

function repairTips(filePath, component, propName, content, replacedContent, position, type) {
  const wrap = '\r\n'
  const positionTip = `在 ${filePath} 文件的 ${position.line}:${position.column} 位置：${wrap}`
  switch (type) {
    case 'deleteProps':
      logger.warn(`${positionTip}\t${component}组件的属性 ${propName} 已删除${wrap}`)
      break
    case 'deprecatedProps':
      logger.error(
        `Todo:${positionTip}\t${component}组件的 ${propName} 属性已废弃,请替换为合适值${wrap}`
      )
      break
    case 'deprecatedPropValue':
      logger.error(
        `Todo:${positionTip}\t${component}组件的 ${propName} 属性的 ${content} 属性值已废弃${wrap}`
      )
      break
    case 'replacedPropName':
      logger.warn(`${positionTip}\t${component}组件的 ${propName} 属性已被替换为 ${content}${wrap}`)
      break
    case 'replacedPropValue':
      logger.warn(
        `${positionTip}\t${component}组件的 ${propName} 属性的 ${content} 属性值已替换为${replacedContent}${wrap}`
      )
      break
  }
}

module.exports = {
  repairTips,
  processComponentName,
  camelCaseForTarget,
  kebabCaseForTarget,
  curry,
  logger,
}
