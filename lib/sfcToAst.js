// const { parse: vueParse } = require('@vue/compiler-sfc')
const compiler = require('@vue/compiler-dom')
const { parse: babelParse } = require('@babel/parser')
const { processTemplateAst } = require('./processTemplateAst')
const { parseJavascript } = require('./parseJavascript')
const generator = require('@babel/generator').default

function sfcToAst(source, options) {
  return parse(source, { compiler, options })
}

function parse(source, { pad = false, compiler, options } = {}) {
  const descriptor = {
    source,
    template: null,
    script: null,
    scriptSetup: null,
    styles: [],
    customBlocks: [],
  }
  const errors = []
  const ast = compiler.parse(source, {
    // there are no components at SFC parsing level
    isNativeTag: () => true,
    // preserve all whitespaces
    isPreTag: () => true,
    getTextMode: ({ tag, props }, parent) => {
      // all top level elements except <template> are parsed as raw text
      // containers
      if (
        (!parent && tag !== 'template') ||
        // <template lang="xxx"> should also be treated as raw text
        (tag === 'template' &&
          props.some(
            (p) =>
              p.type === 6 /* ATTRIBUTE */ &&
              p.name === 'lang' &&
              p.value &&
              p.value.content !== 'html'
          ))
      ) {
        return 2 /* RAWTEXT */
      } else {
        return 0 /* DATA */
      }
    },
    onError: (e) => {
      errors.push(e)
    },
  })
  ast.children.forEach((node) => {
    if (node.type !== 1 /* ELEMENT */) {
      return
    }
    if (!node.children.length && !hasSrc(node) && node.tag !== 'template') {
      return
    }
    switch (node.tag) {
      case 'template':
        if (!descriptor.template) {
          const templateBlock = (descriptor.template = createBlock(node, source, false))
          processTemplateAst(node.children, source, options)
          templateBlock.ast = node
        } else {
          errors.push(createDuplicateBlockError(node))
        }
        break
      case 'script':
        const scriptBlock = createBlock(node, source, pad)
        if (scriptBlock && scriptBlock.content) {
          const jsAst = babelParse(scriptBlock.content, {
            sourceType: 'module',
            plugins: [
              'objectRestSpread',
              'dynamicImport',
              'decorators-legacy',
              'classProperties',
              'typescript',
              'jsx',
            ],
          })
          parseJavascript(jsAst, options)
          scriptBlock.content = `\r\n${generator(jsAst).code}\r\n`
        }
        if (!descriptor.script) {
          descriptor.script = scriptBlock
          break
        }
        break
      case 'style':
        const styleBlock = createBlock(node, source, pad)
        if (styleBlock.attrs.vars) {
          errors.push(
            new SyntaxError(
              `<style vars> has been replaced by a new proposal: ` +
                `https://github.com/vuejs/rfcs/pull/231`
            )
          )
        }
        descriptor.styles.push(styleBlock)
        break
      default:
        descriptor.customBlocks.push(createBlock(node, source, pad))
        break
    }
  })
  const result = {
    descriptor,
    errors,
  }
  return result
}

function createDuplicateBlockError(node, isScriptSetup = false) {
  const err = new SyntaxError(
    `Single file component can contain only one <${node.tag}${
      isScriptSetup ? ` setup` : ``
    }> element`
  )
  err.loc = node.loc
  return err
}
function createBlock(node, source, pad) {
  const type = node.tag
  let { start, end } = node.loc
  let content = ''
  if (node.children.length) {
    start = node.children[0].loc.start
    end = node.children[node.children.length - 1].loc.end
    content = source.slice(start.offset, end.offset)
  }
  const loc = {
    source: content,
    start,
    end,
  }
  const attrs = {}
  const block = {
    type,
    content,
    loc,
    attrs,
  }
  if (pad) {
    block.content = padContent(source, block, pad) + block.content
  }
  node.props.forEach((p) => {
    if (p.type === 6 /* ATTRIBUTE */) {
      attrs[p.name] = p.value ? p.value.content || true : true
      if (p.name === 'lang') {
        block.lang = p.value && p.value.content
      } else if (p.name === 'src') {
        block.src = p.value && p.value.content
      } else if (type === 'style') {
        if (p.name === 'scoped') {
          block.scoped = true
        } else if (p.name === 'module') {
          block.module = attrs[p.name]
        }
      } else if (type === 'script' && p.name === 'setup') {
        block.setup = attrs.setup
      }
    }
  })
  return block
}
function hasSrc(node) {
  return node.props.some((p) => {
    if (p.type !== 6 /* ATTRIBUTE */) {
      return false
    }
    return p.name === 'src'
  })
}
function padContent(content, block, pad) {
  content = content.slice(0, block.loc.start.offset)
  if (pad === 'space') {
    return content.replace(replaceRE, ' ')
  } else {
    const offset = content.split(splitRE).length
    const padChar = block.type === 'script' && !block.lang ? '//\n' : '\n'
    return Array(offset).join(padChar)
  }
}
module.exports = { sfcToAst }
