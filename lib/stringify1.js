function attrString(props) {
  return props
    .map((prop) => {
      const afterProp = makeProp(prop)
      return Object.assign({}, prop, {
        afterProp,
        propLocStart: prop.loc.start.offset - afterProp,
        propLoEnd: prop.loc.start.offset + afterProp,
      })
    })
    .reduce((propCode, prop, index, array) => {
      const first = index === 0
      let newlinesBefore = 0
      if (first) {
        newlinesBefore = prop.propLocStart
      } else {
        const prevBlock = array[index - 1]
        newlinesBefore = prop.propLocStart - prevBlock.propLoEnd
      }
      return propCode + '\n'.repeat(newlinesBefore) + prop.afterProp
    }, ' ')
}

// https://github.com/vuejs/vue-next/blob/master/packages/compiler-core/src/ast.ts#L25
function stringify(buff, doc) {
  switch (doc.type) {
    case 1: // 元素节点
      buff += makeOpenTag(doc)
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
// '<' + doc.tag + (doc.props ? attrString(doc.props) : '') + (doc.isSelfClosing ? ' />' : '>')

function makeOpenTag(block) {
  let source = '<' + block.tag
  source += attrString(block.props)
  source += startOfCloseTag(block)
  source += makeChildrenTags(block.children)
  source += makeCloseTag(block)
  return source
}

function makeChildrenTags(blocks) {
  return blocks.map((block) => {
    const openTag = makeOpenTag(block)
    const closeTag = startOfCloseTag(block)
    return Object.assign({}, block, {
      openTag,
      closeTag,
      startOfOpenTag: block.loc.start.offset - openTag.length,
      endOfOpenTag: block.loc.start.offset,
      startOfCloseTag: block.loc.end.offset,
      endOfCloseTag: block.loc.end.offset + closeTag.length,
    })
  })
}

function startOfCloseTag(block) {
  return block.isSelfClosing ? ` />` : `>`
}
function makeCloseTag(block) {
  return block.isSelfClosing ? ` />\n` : `</${block.type}>\n`
}

function makeProp(prop) {
  const { type, name, arg, exp = {}, value, modifiers } = prop
  let buff = ' '
  // 静态属性节点
  if (type === 6) {
    if (value) {
      buff += `${name}="${value.content}"`
    } else {
      buff += `${name}`
    }
  } // 动态属性节点
  else if (prop.type === 7) {
    if (name === 'on') {
      if (exp.content === '$listeners') {
        buff += `v-on="${exp.content}"`
      } else {
        let onBind = `@${arg.content}`
        if (modifiers.length) {
          onBind += `.${modifiers.join('.')}`
        }
        if (exp && exp.content) {
          onBind += `="${exp.content}"`
        }
        buff += onBind
      }
    } else if (name === 'bind') {
      if (exp.content === '$attrs' || !arg) {
        buff += `v-bind="${exp.content}"`
      } else {
        let bind = `:${arg.content}`
        if (modifiers.length) {
          bind += `.${modifiers.join('.')}`
        }
        if (exp && exp.content) {
          bind += `="${exp.content}"`
        }
        buff += bind
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
      buff += directive
    }
  }
  return buff
}

function genCode(asts) {
  if (!asts || !Array.isArray(asts)) {
    asts = [asts]
  }
  return ast.map((block) => {
    const openTag = makeOpenTag(block)
    const startOfCloseTag = startOfCloseTag(block)
    const closeTag = makeCloseTag(block)
    return Object.assign({}, block, {
      openTag,
      startOfCloseTag,
      closeTag,
      startOfOpenTagLoc: block.loc.start.offset - openTag.length,
      endOfOpenTagLoc: block.loc.start.offset,
      startOfCloseTagLoc: block.loc.end.offset,
      endOfCloseTagLoc: block.loc.end.offset + closeTag.length,
    })
  })
}
module.exports = function (ast) {
  if (!ast || !Array.isArray(ast)) {
    ast = [ast]
  }
  return ast.reduce(function (token, rootEl) {
    return token + stringify('', rootEl)
  }, '')
}
