function stringify(sfcDescriptor) {
  const { template, script, styles, customBlocks } = sfcDescriptor
  return (
    [template, script, ...styles, ...customBlocks]
      // discard blocks that don't exist
      .filter((block) => block != null)
      // sort blocks by source position
      .sort((a, b) => a.loc.start.offset - b.loc.start.offset)
      // figure out exact source positions of blocks
      .map((block) => {
        const openTag = makeOpenTag(block)
        const closeTag = makeCloseTag(block)
        return Object.assign({}, block, {
          openTag,
          closeTag,
          endOfOpenTag: block.loc.start.offset,
          startOfCloseTag: block.loc.end.offset,
          column: block.loc.column,
        })
      })
      // generate sfc source
      .reduce((sfcCode, block, index, array) => {
        const first = index === 0
        let newlinesBefore = 0
        if (first) {
          newlinesBefore = block.startOfOpenTag
        } else {
          const prevBlock = array[index - 1]
          newlinesBefore = block.startOfOpenTag - prevBlock.endOfCloseTag
        }
        if (block.type === 'template') {
          return (
            sfcCode +
            '\n'.repeat(newlinesBefore) +
            block.openTag +
            makeTemplateChildrenAst(block.ast.children) +
            block.closeTag
          )
        }
        return (
          sfcCode + '\n'.repeat(newlinesBefore) + block.openTag + block.content + block.closeTag
        )
      }, '')
  )
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
    }, '')
}

function makeTemplateChildrenAst(blocks) {
  return blocks
    .filter((block) => block != null)
    .map((block) => {
      const openTag = makeStartOpenTag(block)
      const closeTag = makeCloseOfTag(block)
      let textStartLen = openTag.length
      let textCloseLen = closeTag.length

      if (block.type !== 1) {
        textStartLen = block.loc.source.length
      }
      if (block.type !== 1) {
        textCloseLen = textStartLen
      }
      return Object.assign({}, block, {
        openTag,
        closeTag,
        textStartLen,
        startOfOpenTag: block.loc.end.offset - block.loc.start.offset,
        endOfOpenTag: block.loc.start.offset,
        startOfCloseTag: block.loc.end.offset,
        endOfCloseTag: block.loc.end.offset + textCloseLen,
      })
    })
    .reduce((sfcCode, block, index, array) => {
      const first = index === 0
      let newlinesBefore = 0
      if (first) {
        newlinesBefore = block.startOfOpenTag
      } else {
        const prevBlock = array[index - 1]
        newlinesBefore = block.startOfOpenTag - prevBlock.endOfCloseTag
        // console.log(block.startOfOpenTag, prevBlock.endOfCloseTag)
      }
      // console.log('sfcCodesfcCodesfcCode,  ', newlinesBefore)
      return sfcCode + '\n'.repeat(newlinesBefore) + makeChildrenEl('', block)
    }, '')
}

function makeChildrenEl(buff, block, newlinesBefore) {
  switch (block.type) {
    case 1: // 元素节点
      if (block.isSelfClosing) {
        return block.openTag
      }
      return buff + block.openTag + makeTemplateChildrenAst(block.children) + block.closeTag
    case 2: // 文本节点
      return `${buff}${block.loc.source}`
    case 3: // 注释节点
      buff += block.loc.source
      return buff
    case 5: // {{}} 插值
      buff += `${block.loc.source}`
      return buff
  }
}

// 子元素使用
function makeStartOpenTag(block) {
  if (block.type !== 1) {
    return block
  }
  let source = '<' + block.tag
  source += attrString(block.props)
  source += makeStartOfCloseTag(block)
  return source
}

function makeStartOfCloseTag(block) {
  return block.isSelfClosing ? ` />` : `>`
}
function makeCloseOfTag(block) {
  if (block.type !== 1) {
    return block
  }
  return block.isSelfClosing ? '' : `</${block.tag}>\n`
}
// template style script 使用
function makeOpenTag(block) {
  let source = '<' + block.type
  source += Object.keys(block.attrs)
    .sort()
    .map((name) => {
      const value = block.attrs[name]
      if (value === true) {
        return name
      } else {
        return `${name}="${value}"`
      }
    })
    .map((attr) => ' ' + attr)
    .join('')
  return source + '>'
}
function makeCloseTag(block) {
  return `</${block.type}>\n`
}

module.exports = stringify
