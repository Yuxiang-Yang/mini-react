import React from '../core/React'
export default function Todos() {
  const [todos, setTodos] = React.useState([
    // { title: '吃饭', id: crypto.randomUUID(), status: 'active' },
    // { title: '睡觉', id: crypto.randomUUID(), status: 'active' },
    // { title: '写代码', id: crypto.randomUUID(), status: 'active' },
  ])
  const [displayTodos, setDisplayTodos] = React.useState(todos)
  const [inputValue, setInputValue] = React.useState('')
  const [filter, setFilter] = React.useState('all')

  React.useEffect(() => {
    const rawTodos = localStorage.getItem('todos')
    if (rawTodos) {
      setTodos(JSON.parse(rawTodos))
    }
  }, [])

  React.useEffect(() => {
    let newTodos
    if (filter === 'all') {
      newTodos = todos
    } else if (filter === 'active') {
      newTodos = todos.filter(todo => todo.status === 'active')
    } else if (filter === 'done') {
      newTodos = todos.filter(todo => todo.status === 'done')
    }

    setDisplayTodos(newTodos)
  }, [filter, todos])

  function handleAdd() {
    addTodo(inputValue)
    setInputValue('')
  }

  function createTodo(title) {
    return {
      title: title,
      id: crypto.randomUUID(),
      status: 'active',
    }
  }

  function addTodo(inputValue) {
    setTodos([...todos, createTodo(inputValue)])
  }

  function removeTodo(id) {
    const newTodos = todos.filter(todo => todo.id !== id)
    setTodos(newTodos)
  }

  function doneTodo(id) {
    const newTodos = todos.map(todo => (todo.id === id ? { ...todo, status: 'done' } : todo))
    setTodos(newTodos)
  }

  function cancelTodo(id) {
    const newTodos = todos.map(todo => (todo.id === id ? { ...todo, status: 'active' } : todo))
    setTodos(newTodos)
  }

  function saveTodo() {
    localStorage.setItem('todos', JSON.stringify(todos))
  }
  return (
    <div>
      <div>Todos</div>
      <input type="text" value={inputValue} onInput={e => setInputValue(e.target.value)} />
      <button onClick={handleAdd}>add</button>
      <div>
        <button onClick={saveTodo}>save</button>
      </div>
      <div>
        <input type="radio" name="filter" id="all" checked={filter === 'all'} onChange={() => setFilter('all')} />
        <label htmlFor="all">all</label>
        <input
          type="radio"
          name="filter"
          id="active"
          checked={filter === 'active'}
          onChange={() => setFilter('active')}
        />
        <label htmlFor="active">active</label>
        <input type="radio" name="filter" id="done" checked={filter === 'done'} onChange={() => setFilter('done')} />
        <label htmlFor="done">done</label>
      </div>
      <ul>
        {...displayTodos.map(todo => {
          return (
            <li className={todo.status}>
              <TodoItem todo={todo} removeTodo={removeTodo} doneTodo={doneTodo} cancelTodo={cancelTodo}></TodoItem>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function TodoItem({ todo, removeTodo, doneTodo, cancelTodo }) {
  return (
    <div>
      {todo.title}
      <button onClick={() => removeTodo(todo.id)}>remove</button>
      {todo.status === 'active' ? (
        <button onClick={() => doneTodo(todo.id)}>done</button>
      ) : (
        <button onClick={() => cancelTodo(todo.id)}>cancel</button>
      )}
    </div>
  )
}
