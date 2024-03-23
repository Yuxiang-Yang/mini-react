function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => {
        if (typeof child === 'string') {
          return createTextNode(child)
        } else {
          return child
        }
      }),
    },
  }
}

function createTextNode(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: [],
    },
  }
}

function render(el, container) {
  const dom = el.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(el.type)

  for (const [key, value] of Object.entries(el.props)) {
    if (key !== 'children') {
      dom[key] = value
    }
  }

  const children = el.props.children
  children.forEach(child => {
    render(child, dom)
  })

  container.append(dom)
}

const React = {
  render,
  createElement
}

export default React
