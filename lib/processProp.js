const { repairTips } = require('../shard/helper')

function processProp(ast, component, options, config) {
  const {
    prefix: { before, needReplaced = true, after },
    filePath,
  } = config
  if (needReplaced) {
    const prefixReg = new RegExp(before, 'i')
    ast.tag = ast.tag.replace(prefixReg, after)
  }
  const { props } = ast
  const cloneProps = JSON.parse(JSON.stringify(props))
  for (const propsAstElement of cloneProps) {
    const {
      type,
      value,
      name: propName,
      arg,
      loc: { start },
    } = propsAstElement
    // 静态属性-----------------start------------------------
    if (type === 6) {
      processStaticProp(
        filePath,
        component,
        propName,
        value,
        start,
        props,
        propsAstElement,
        options
      )
    } // 动态属性-----------------start------------------------
    else if (type === 7) {
      processDynamicProp(filePath, component, propName, arg, start, props, propsAstElement, options)
    }
  }
  ast.props = cloneProps
}

function processStaticProp(
  filePath,
  component,
  propName,
  value,
  start,
  props,
  propsAstElement,
  options
) {
  const {
    replacedPropName = {},
    replacedPropValue = {},
    deprecatedProps = [],
    deprecatedPropValue = {},
    deleteProps = [],
  } = options
  const { content } = value || {}
  // 已弃用属性
  if (deprecatedProps.includes(propName)) {
    repairTips(filePath, component, propName, '', '', start, 'deprecatedProps')
  } // 已弃用属性值
  else if (deprecatedPropValue[propName]) {
    if (deprecatedPropValue[propName].includes(content)) {
      repairTips(filePath, component, propName, content, '', start, 'deprecatedPropValue')
    }
  } // 需要替换的属性, !!!会改变ast
  else if (replacedPropName[propName]) {
    const replaceName = replacedPropName[propName]
    propsAstElement.name = replaceName
    repairTips(filePath, component, propName, replaceName, '', start, 'replacedPropName')
  } // 需要替换的属性值 !!!会改变ast
  else if (replacedPropValue[propName]) {
    const replaceProp = replacedPropValue[propName]
    if (replaceProp[content]) {
      propsAstElement.value.content = replaceProp[content]
      repairTips(
        filePath,
        component,
        propName,
        content,
        replaceProp[content],
        start,
        'replacedPropValue'
      )
    }
  } // 需要删除的属性 !!!会改变ast
  else if (deleteProps.includes(propName)) {
    const propsIndex = props.findIndex((item) => propsAstElement === item)
    props.splice(propsIndex, 1)
    repairTips(filePath, component, propName, '', '', start, 'deleteProps')
  }
}

function processDynamicProp(
  filePath,
  component,
  propName,
  arg,
  start,
  props,
  propsAstElement,
  options
) {
  const {
    replacedPropName = {},
    replacedPropValue = {},
    deprecatedProps = [],
    deleteProps = [],
  } = options
  const { content: bindPropName } = arg || {}
  // 已弃用属性
  if (deprecatedProps.includes(bindPropName)) {
    repairTips(filePath, component, bindPropName, '', '', start, 'deprecatedProps')
  } // 需要替换的属性, !!!会改变ast
  else if (replacedPropName[bindPropName]) {
    const content = replacedPropName[bindPropName]
    propsAstElement.arg.content = content
    repairTips(filePath, component, bindPropName, content, '', start, 'replacedPropName')
  } // 需要提示的属性值
  else if (replacedPropValue[bindPropName]) {
    const propValue = replacedPropValue[bindPropName]
    if (propValue) {
      let content = ''
      for (const propValueKey in propValue) {
        content += `{${propValueKey} ==> ${propValue[propValueKey]}}`
      }
      repairTips(filePath, component, bindPropName, content, '', start, 'replacedPropValue')
    }
  } // 需要删除的属性 !!!会改变ast
  else if (deleteProps.includes(bindPropName)) {
    const propsIndex = props.findIndex((item) => propsAstElement === item)
    props.splice(propsIndex, 1)
    repairTips(filePath, component, bindPropName, '', '', start, 'deleteProps')
  }
}

module.exports = {
  processProp,
}
