import { useEffect, useRef, useState } from 'react'
import todo_icon from '../assets/todo_icon.png'
import TodoItems from './TodoItems.jsx'

function Todo() {
  const inputRef = useRef()
  const savedTodos = localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : []
  const savedPoints = Number(localStorage.getItem('points') || 0)
  const initialPoints = Number.isNaN(savedPoints) ? 0 : savedPoints
  const [todoList, setTodoList] = useState(savedTodos)
  const [points, setPoints] = useState(initialPoints || savedTodos.filter(t => t.isCompleted).length)
  const [message, setMessage] = useState('')
  const [quote, setQuote] = useState('')
  const [flash, setFlash] = useState(false)
  const [focusId, setFocusId] = useState(null)

  const quotes = [
    'Small steps add up',
    'You can do this',
    'Keep going',
    'Done is better than perfect',
    'One task at a time',
    'Start now'
  ]

  const fun = [
    'Great job',
    'Nice one',
    'Level Up',
    'You are on a roll',
    'Sweet progress'
  ]

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

  const addTodo = () => {
    const raw = inputRef.current ? inputRef.current.value : ''
    const inputText = raw.trim()
    if (inputText.length === 0) return
    const newTodo = { id: Date.now(), text: inputText, isCompleted: false }
    setTodoList(prev => [...prev, newTodo])
    inputRef.current.value = ''
  }

  const toggleTodo = (id) => {
    const target = todoList.find(t => t.id === id)
    const wasDone = target ? target.isCompleted : false
    setTodoList(prev => prev.map(item => item.id === id ? { ...item, isCompleted: !item.isCompleted } : item))
    if (!wasDone) {
      setPoints(p => p + 1)
      setMessage(pick(fun))
      setQuote(pick(quotes))
      setFlash(true)
      setTimeout(() => setFlash(false), 500)
    } else {
      setPoints(p => (p > 0 ? p - 1 : 0))
    }
  }

  const deleteTodo = (id) => {
    setTodoList(prev => prev.filter(item => item.id !== id))
    if (focusId === id) setFocusId(null)
  }

  const randomTask = () => {
    const open = todoList.filter(t => !t.isCompleted)
    const pool = open.length > 0 ? open : todoList
    if (pool.length === 0) return
    const chosen = pool[Math.floor(Math.random() * pool.length)]
    setFocusId(chosen.id)
  }

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todoList))
  }, [todoList])

  useEffect(() => {
    localStorage.setItem('points', String(points))
    if (points === 5 || points === 10 || points === 20 || points === 50) {
      setMessage('Level Up')
      setFlash(true)
      const t = setTimeout(() => setFlash(false), 700)
      return () => clearTimeout(t)
    }
  }, [points])

  useEffect(() => {
    setQuote(pick(quotes))
  }, [])

  useEffect(() => {
    if (message) {
      const t = setTimeout(() => setMessage(''), 1500)
      return () => clearTimeout(t)
    }
  }, [message])

  const containerClass = `place-self-center min-h-[550px] w-11/12 max-w-md p-7 rounded-xl flex flex-col transition-colors ${flash ? 'bg-green-100' : 'bg-amber-50'}`

  return (
    <div className={containerClass}>
      <div className='flex items-center mt-7 gap-2'>
        <img className='w-10' src={todo_icon} alt='' />
        <h1 className='text-3xl font-semibold'>To-Do List</h1>
      </div>

      <div className='flex items-center mt-3 gap-3'>
        <div className='text-sm bg-blue-100 text-blue-700 rounded-full px-3 py-1'>Points {points}</div>
        <button onClick={randomTask} className='text-sm bg-purple-500 text-white rounded-full px-3 py-1'>Random Task</button>
      </div>

      {message ? <div className='mt-3 text-center text-green-700 text-lg font-medium'>{message}</div> : null}
      {quote ? <div className='mt-1 text-center text-slate-700'>{quote}</div> : null}

      <div className='flex items-center my-7 bg-gray-200 rounded-full'>
        <input ref={inputRef} className='bg-transparent border-0 outline-none flex-1 h-14 pl-6 pr-2 placeholder:text-slate-600' type='text' placeholder='Enter your task' />
        <button onClick={addTodo} className='border-none rounded-full w-32 h-14 bg-blue-400 text-white text-lg font-medium cursor-pointer'>Add</button>
      </div>

      <div>
        {todoList.map(item => (
          <TodoItems
            key={item.id}
            text={item.text}
            id={item.id}
            isCompleted={item.isCompleted}
            focused={focusId === item.id && !item.isCompleted}
            deleteTodo={deleteTodo}
            toggleTodo={toggleTodo}
          />
        ))}
      </div>
    </div>
  )
}

export default Todo