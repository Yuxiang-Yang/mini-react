let taskId = 1

function workLoop(IdleDeadLine) {
  taskId++
  console.log(IdleDeadLine.timeRemaining())
  let shouldYield = false
  while (!shouldYield) {
    console.log(`taskId: ${taskId}`)
    shouldYield = IdleDeadLine.timeRemaining() < 1
  }
  requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)
