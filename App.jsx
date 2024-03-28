import React from "./core/React.js"
let count = 0
let showFoo = true

function Counter({ onClick }) {
  const foo = (
    <div>
      foo
      <div>111</div>
      <div>222</div>
    </div>
  )

  const bar = <div>bar</div>
  return (
    <div>
      <span>count: {count}</span>
      <button onClick={onClick}>add</button>
      <div>{showFoo ? foo : bar}</div>
      <button onClick={handleFooShow}>toggleShowFoo</button>
    </div>
  )
}
function handleClick() {
  console.log('clicked!!')
  count++
  React.update()
}
function handleFooShow() {
  showFoo = !showFoo
  React.update()
}
function App() {
  return (
    <div className="main">
      <div>
        <span>hello</span>
      </div>
      <span>mini-react</span>
      <Counter onClick={handleClick}></Counter>
    </div>
  )
}
export default App