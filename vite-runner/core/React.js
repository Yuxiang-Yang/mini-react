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

function performWorkOfUnit(work) {
  if (!work.dom) {
    // 1.创建dom
    const dom = work.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(work.type)
    work.dom = dom
    work.parent.dom.append(dom)
  }
  // 2.处理props
  for (const [key, value] of Object.entries(work.props)) {
    if (key !== 'children') {
      work.dom[key] = value
    }
  }
  // 3.转换链表，设置指针
  let children = work.props.children
  let prevChild = null
  children.forEach((child, index) => {
    const newWork = {
      type: child.type,
      props: child.props,
      parent: work,
      child: null,
      sibling: null,
      dom: null,
    }
    if (index === 0) {
      work.child = newWork
    } else {
      prevChild.sibling = newWork
    }
    prevChild = newWork
  })
  // 4.返回下一个任务
  if (work.child) {
    return work.child
  }
  let nextWork = work
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
