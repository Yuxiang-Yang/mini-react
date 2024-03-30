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
      <div>123{false && '222'}321</div>
    </div>
  )
}
function Foo() {
  console.log('foo run')
  const [count, setCount] = React.useState(10)
  const [name, setName] = React.useState('Johnny Sliverhand')
  
  React.useEffect(() => {
    console.log('init')
    return () => console.log('cleanup0')
  }, [])
  React.useEffect(() => {
    console.log('update')
    return () => console.log('cleanup')
  }, [count])

  function handleClick() {
    setCount(count => count + 1)
    // setName(name => name + '!')
    setName('V')
  }
  return (
    <div>
      <div>fooCount: {count}</div>
      <div>name: {name}</div>
      <button onClick={handleClick}>add</button>
    </div>
  )
}
let barCount = 0
function Bar() {
  console.log('bar run')
  const update = React.update()
  function handleClick() {
    barCount++
    update()
  }
  return (
    <div>
      <div>barCount: {barCount}</div>
      <button onClick={handleClick}>add</button>
    </div>
  )
}

function handleFooShow() {
  showFoo = !showFoo
  React.update()
}
function App() {
  const update = React.update()
  function handleClick() {
    console.log('clicked!!')
    count++
    update()
  }
  return (
    <div className="main">
      {/* <div>
        <span>hello</span>
      </div>
      <span>mini-react</span>
      <div>{false && bar}</div>
      <button onClick={handleFooShow}>toggleShowFoo</button> */}
      {/* <Counter onClick={handleClick}></Counter> */}
      {/* {count}
      <button onClick={handleClick}>add</button> */}
      <Foo></Foo>
      {/* <Bar></Bar> */}
    </div>
  )
}
export default App