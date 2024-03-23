// const textNode = {
//   type: 'TEXT_ELEMENT',
//   props: {
//     nodeValue: 'hello mini-react',
//     children: [],
//   },
// }

// const el = {
//   type: 'div',
//   prop: {
//     id: 'app',
//     children: [textNode],
//   },
// }

// const container = document.createElement('div')
// container.id = 'app'
// document.querySelector('root').append(container)

// const div = document.createElement('div')
// container.append(div)

// const textElement = document.createTextElement('hello mini-react')
// div.append(textNode)

function createElement(type, props, children = []) {
  return {
    type,
    props: {
      ...props,
      children,
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

const textEl = createTextNode('hello mini-react')
const App = createElement('div', { id: 'app' }, [
  textEl,
  createElement('div', {}, [
    createElement('div', {}, [createElement('div', {}, [createElement('div', {}, [textEl])])]),
  ]),
])
render(App, document.querySelector('#root'))
