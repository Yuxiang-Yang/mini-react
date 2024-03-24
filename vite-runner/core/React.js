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
let nextWorkOfUnit = null
function render(el, container) {
  nextWorkOfUnit = {
    dom: container,
    props: {
      children: [el],
    },
  }
  requestIdleCallback(workLoop)
}
function workLoop(IdleDeadLine) {
  let shouldYield = false
  while (!shouldYield && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit)
    shouldYield = IdleDeadLine.timeRemaining() < 1
  }
  requestIdleCallback(workLoop)
}
function createDOM(fiber) {
  return fiber.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(fiber.type)
}
function updateProps(dom, props) {
  for (const [key, value] of Object.entries(props)) {
    if (key !== 'children') {
      dom[key] = value
    }
  }
}
function initChildren(fiber) {
  let children = fiber.props.children
  let prevChild = null
  children.forEach((child, index) => {
    const newWork = {
      type: child.type,
      props: child.props,
      parent: fiber,
      child: null,
      sibling: null,
      dom: null,
    }
    if (index === 0) {
      fiber.child = newWork
    } else {
      prevChild.sibling = newWork
    }
    prevChild = newWork
  })
}
function performWorkOfUnit(fiber) {
  if (!fiber.dom) {
    const dom = createDOM(fiber)
    fiber.dom = dom
    fiber.parent.dom.append(dom)
    updateProps(dom, fiber.props)
  }
  initChildren(fiber)
  // 4.返回下一个任务
  if (fiber.child) {
    return fiber.child
  }
  let nextWork = fiber
  while (nextWork) {
    if (nextWork.sibling) {
      return nextWork.sibling
    }
    nextWork = nextWork.parent
  }
}


const React = {
  render,
  createElement
}

export default React
