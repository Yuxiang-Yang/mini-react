import React from "./core/React.js"
function Counter({ num }) {
  return <div>count: {num}</div>
}
function App() {
  return (
    <div className="main">
      <div>
        <span>hello</span>
      </div>
      <span>mini-react</span>
      <Counter num={10}></Counter>
      <Counter num={20}></Counter>
    </div>
  )
}
export default App