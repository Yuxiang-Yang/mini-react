import React from "./core/React.js"
function Counter({ onClick }) {
  return (
    <div>
      <span>count: {count}</span>
      <button onClick={onClick}>add</button>
    </div>
  )
}
let count = 0
function handleClick() {
  console.log('clicked!!')
  count++
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