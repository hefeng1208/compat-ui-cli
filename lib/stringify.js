function attrString(props) {
  const buff = []
  for (const prop of props) {
    const { type, name, arg, exp = {}, value, modifiers } = prop
    // 静态属性节点
    if (type === 6) {
      if (value) {
        buff.push(`${name}="${value.content}"`)
      } else {
        buff.push(`${name}`)
      }
    } // 动态属性节点
    else if (prop.type === 7) {
      if (name === 'on') {
        if (exp.content === '$listeners') {
          buff.push(`v-on="${exp.content}"`)
        } else {
          let onBind = `@${arg.content}`
          if (modifiers.length) {
            onBind += `.${modifiers.join('.')}`
          }
          if (exp && exp.content) {
            onBind += `="${exp.content}"`
          }
          buff.push(onBind)
        }
      } else if (name === 'bind') {
        if (exp.content === '$attrs' || !arg) {
          buff.push(`v-bind="${exp.content}"`)
        } else {
          let bind = `:${arg.content}`
          if (modifiers.length) {
            bind += `.${modifiers.join('.')}`
          }
          if (exp && exp.content) {
            bind += `="${exp.content}"`
          }
          buff.push(bind)
        }
      } else {
        // 是指令
        let directive = `v-${name}`
        if (arg && arg.content) {
          directive += `:${arg.content}`
        }
        if (modifiers.length) {
          directive += `.${modifiers.join('.')}`
        }
        if (exp && exp.content) {
          directive += `="${exp.content}"`
        }
        buff.push(directive)
      }
    }
  }
  if (!buff.length) {
    return ''
  }
  return ' ' + buff.join(' ')
}

// https://github.com/vuejs/vue-next/blob/master/packages/compiler-core/src/ast.ts#L25
function stringify(buff, doc) {
  switch (doc.type) {
    case 1: // 元素节点
      buff +=
        '<' + doc.tag + (doc.props ? attrString(doc.props) : '') + (doc.isSelfClosing ? ' />' : '>')
      if (doc.isSelfClosing) {
        return buff
      }
      return buff + doc.children.reduce(stringify, '') + '</' + doc.tag + '>'
    case 2: // 文本节点
      return `${buff}${doc.loc.source}`
    case 3: // 注释节点
      buff += doc.loc.source
      return buff
    case 5: // {{}} 插值
      buff += `${doc.loc.source}`
      return buff
  }
}

module.exports = function (ast) {
  if (!ast || !Array.isArray(ast)) {
    ast = [ast]
  }
  return ast.reduce(function (token, rootEl) {
    return token + stringify('', rootEl)
  }, '')
}
