function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => {
        const isTextNode = typeof child === 'string' || typeof child === 'number'
        return isTextNode ? createTextNode(child) : child
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
let wipRoot = null //现在的root节点
let oldRoot = null //之前的root节点
let wipFiber = null //现在的fiber
let nextWorkOfUnit = null //下一个要操作的fiber
let deletions = [] //要删除的节点
function render(el, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [el],
    },
  }
  nextWorkOfUnit = wipRoot
}

function workLoop(IdleDeadLine) {
  let shouldYield = false
  while (!shouldYield && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit)
    //只执行有变化的函数组件
    if (wipRoot?.sibling?.type === nextWorkOfUnit?.type) {
      nextWorkOfUnit = null
    }
    shouldYield = IdleDeadLine.timeRemaining() < 1
  }
  if (!nextWorkOfUnit && wipRoot) {
    commitRoot()
    if (nextWorkOfUnit) {
      //hooks引起dom更新后，重新渲染
      wipRoot = oldRoot
    }
  }
  requestIdleCallback(workLoop)
}
function commitRoot() {
  deletions.forEach(commitDeletion)
  deletions = []
  commitWork(wipRoot.child)
  commitEffectHooks()
  oldRoot = wipRoot
  wipRoot = null
}

function commitDeletion(fiber) {
  //对函数组件做特殊处理
  if (fiber.dom) {
    let fiberParent = fiber.parent
    while (!fiberParent.dom) {
      fiberParent = fiberParent.parent
    }
    fiberParent.dom.removeChild(fiber.dom)
  } else {
    commitDeletion(fiber.child)
  }
}

function commitWork(fiber) {
  if (!fiber) return
  //对函数组件做特殊处理
  let fiberParent = fiber.parent
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent
  }
  if (fiber.effectTag === 'update' && fiber.dom) {
    updateProps(fiber.dom, fiber.props, fiber.alternate.props)
  } else if (fiber.effectTag === 'placement') {
    if (fiber.dom) {
      fiberParent.dom.append(fiber.dom)
    }
  }

  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

function commitEffectHooks() {
  function run(fiber) {
    if (!fiber) return

    if (!fiber.alternate) {
      //init
      fiber.effectHooks?.forEach(hook => {
        hook.cleanup = hook.callback()
      })
    } else {
      //update
      fiber.effectHooks?.forEach((newHook, index) => {
        if (newHook.deps.length > 0) {
          const oldEffectHook = fiber.alternate?.effectHooks[index]

          const needUpdate = oldEffectHook?.deps.some((oldDep, i) => {
            return oldDep !== newHook.deps[i]
          })

          needUpdate && (newHook.cleanup = newHook.callback())
        }
      })
    }
    run(fiber.child)
    run(fiber.sibling)
  }

  function runCleanup(fiber) {
    if (!fiber) return

    fiber?.alternate?.effectHooks?.forEach(hook => {
      if (hook.deps.length > 0) {
        hook.cleanup && hook.cleanup()
      }
    })

    runCleanup(fiber.child)
    runCleanup(fiber.sibling)
  }

  runCleanup(wipRoot)
  run(wipRoot)
}

function createDOM(fiber) {
  return fiber.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(fiber.type)
}

function updateProps(dom, newProps, oldProps) {
  Object.keys(oldProps).forEach(key => {
    if (key !== 'children') {
      if (!(key in newProps)) {
        dom.removeAttribute(key)
      }
    }
  })
  Object.keys(newProps).forEach(key => {
    if (key !== 'children') {
      if (newProps[key] !== oldProps[key]) {
        if (key.startsWith('on')) {
          const eventType = key.slice(2).toLowerCase()
          dom.removeEventListener(eventType, oldProps[key])
          dom.addEventListener(eventType, newProps[key])
        }
        dom[key] = newProps[key]
      }
    }
  })
}

function reconcileChildren(fiber, children) {
  let oldFiber = fiber.alternate?.child
  let prevChild = null
  children.forEach((child, index) => {
    const isSameType = oldFiber && oldFiber.type === child.type
    let newFiber
    if (isSameType) {
      newFiber = {
        type: child.type,
        props: child.props,
        parent: fiber,
        child: null,
        sibling: null,
        dom: oldFiber.dom,
        effectTag: 'update',
        alternate: oldFiber,
      }
    } else {
      //处理child为falsy的情况
      if (child) {
        newFiber = {
          type: child.type,
          props: child.props,
          parent: fiber,
          child: null,
          sibling: null,
          dom: null,
          effectTag: 'placement',
        }
      }

      if (oldFiber) {
        deletions.push(oldFiber)
      }
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling
    }

    if (index === 0) {
      fiber.child = newFiber
    } else {
      prevChild.sibling = newFiber
    }
    //处理child为falsy的情况,跳过该节点
    if (newFiber) {
      prevChild = newFiber
    }
  })
  //新比旧少，删除多余的老节点
  while (oldFiber) {
    deletions.push(oldFiber)
    oldFiber = oldFiber.sibling
  }
}

function updateFunctionComponent(fiber) {
  stateHooks = []
  effectHooks = []
  stateHookIndex = 0
  wipFiber = fiber
  const children = [fiber.type(fiber.props)]
  reconcileChildren(fiber, children)
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    const dom = createDOM(fiber)
    fiber.dom = dom
    updateProps(dom, fiber.props, {})
  }

  const children = fiber.props.children
  reconcileChildren(fiber, children)
}

function performWorkOfUnit(fiber) {
  const isFunctionComponent = typeof fiber.type === 'function'
  if (isFunctionComponent) {
    updateFunctionComponent(fiber)
  } else {
    updateHostComponent(fiber)
  }
  // 返回下一个任务
  if (fiber.child) {
    return fiber.child
  }
  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }
}

requestIdleCallback(workLoop)

function update() {
  const currentFiber = wipFiber
  //使用闭包保存当前组件所在的fiber
  return () => {
    wipRoot = {
      ...currentFiber,
      alternate: currentFiber,
    }
    nextWorkOfUnit = wipRoot
  }
}
let stateHooks
let stateHookIndex
function useState(initial) {
  const currentFiber = wipFiber
  const oldHook = currentFiber.alternate?.stateHooks[stateHookIndex]
  const stateHook = {
    state: oldHook ? oldHook.state : initial,
    queue: oldHook ? oldHook.queue : [],
  }

  stateHook.queue.forEach(action => {
    stateHook.state = action(stateHook.state)
  })

  stateHook.queue = []

  stateHookIndex++
  stateHooks.push(stateHook)
  currentFiber.stateHooks = stateHooks

  function setState(action) {
    //state相同，不进行更新
    const eagerState = typeof action === 'function' ? action(stateHook.state) : action
    if (eagerState === stateHook.state) return

    //收集actions，批量更新
    stateHook.queue.push(typeof action === 'function' ? action : () => action)

    wipRoot = {
      ...currentFiber,
      alternate: currentFiber,
    }
    nextWorkOfUnit = wipRoot
  }
  return [stateHook.state, setState]
}

let effectHooks
function useEffect(callback, deps) {
  const effectHook = {
    callback,
    deps,
    cleanup: null,
  }

  effectHooks.push(effectHook)
  wipFiber.effectHooks = effectHooks
}

const React = {
  useState,
  useEffect,
  update,
  render,
  createElement,
}

export default React
