const { repairTips } = require('../shard/helper')
function processAttrs(
  attrAsts,
  component,
  { replacedPropName, replacedPropValue, deprecatedProps, deprecatedPropValue, deleteProps },
  config
) {
  const { filePath } = config
  for (const attrAst of attrAsts) {
    const {
      name: { name: attrName },
      loc: { start },
      value,
    } = attrAst.node
    if (deprecatedProps.includes(attrName)) {
      repairTips(filePath, component, attrName, '', '', start, 'deprecatedProps')
    } // 已弃用属性值
    else if (deprecatedPropValue[attrName]) {
      if (value && deprecatedPropValue[attrName].includes(value.value)) {
        repairTips(filePath, component, attrName, value.value, '', start, 'deprecatedPropValue')
      }
    } // 需要替换的属性, !!!会改变ast
    else if (replacedPropName[attrName]) {
      const replaceName = replacedPropName[attrName]
      attrAst.node.name.name = replaceName
      repairTips(filePath, component, attrName, replaceName, '', start, 'replacedPropName')
    } // 需要替换的属性值 !!!会改变ast
    else if (replacedPropValue[attrName]) {
      const replaceProp = replacedPropValue[attrName]
      const replaceValue = value && replaceProp[value.value]
      if (replaceValue) {
        attrAst.node.value.value = replaceValue
        repairTips(
          filePath,
          component,
          attrName,
          value.value,
          replaceValue,
          start,
          'replacedPropValue'
        )
      }
    } // 需要删除的属性 !!!会改变ast
    else if (deleteProps.includes(attrName)) {
      attrAst.remove()
      repairTips(filePath, component, attrName, '', '', start, 'deleteProps')
    }
  }
}
module.exports = {
  processAttrs,
}
