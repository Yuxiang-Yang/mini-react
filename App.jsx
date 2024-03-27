import React from "./core/React.js"
function Counter({ onClick, num }) {
  return (
    <div>
      <span>count: {num}</span>
      <button onClick={onClick}>add</button>
    </div>
  )
}
function handleClick() {
  console.log('clicked!!')
}
function App() {
  return (
    <div className="main">
      <div>
        <span>hello</span>
      </div>
      <span>mini-react</span>
      <Counter num={10} onClick={handleClick}></Counter>
      <button onClick={handleClick}>click</button>
    </div>
  )
}
export default App