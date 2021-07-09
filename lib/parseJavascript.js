const traverse = require('@babel/traverse').default
const bt = require('@babel/types')
const { processComponentName } = require('../shard/helper')
const componentMap = require('../shard/componentMap')

function parseJavascript(ast, options) {
  const {
    prefix: { before, needReplaced = true, after },
  } = options
  const prefixReg = new RegExp(before, 'i')

  traverse(ast, {
    ExportDefaultDeclaration(rootPath) {
      rootPath.traverse({
        ObjectMethod(path) {
          if (path.node.key.name === 'render') {
            const bodyPath = path.get('body')
            bodyPath.traverse({
              ReturnStatement(returnPath) {
                if (bt.isJSXElement(returnPath.get('argument'))) {
                  const openingElement = returnPath.get('argument').get('openingElement')
                  const closingElement = returnPath.get('argument').get('closingElement')
                  openingElement.traverse({
                    JSXIdentifier(jsxPath) {
                      const name = jsxPath.node.name
                      const compName = processComponentName(name, before)
                      if (componentMap[compName]) {
                        if (needReplaced) {
                          jsxPath.node.name = jsxPath.node.name.replace(prefixReg, after)
                        }
                        const attrNode = openingElement.get('attributes')
                        componentMap[compName](attrNode, 'js', options)
                      }
                    },
                  })
                  closingElement.traverse({
                    JSXIdentifier(jsxPath) {
                      const name = jsxPath.node.name
                      const compName = processComponentName(name, before)
                      if (componentMap[compName]) {
                        if (needReplaced) {
                          jsxPath.node.name = jsxPath.node.name.replace(prefixReg, after)
                        }
                      }
                    },
                  })
                }
              },
            })
          }
        },
      })
    },
  })
}

module.exports = {
  parseJavascript,
}
