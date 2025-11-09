import tick from '../assets/tick.png'
import not_tick from '../assets/not_tick.png'
import delete_icon from '../assets/delete.png'

const TodoItems = ({ text, id, isCompleted, focused, deleteTodo, toggleTodo }) => {
  const box = focused ? 'bg-yellow-200 ring-2 ring-yellow-400' : 'bg-gray-300'
  return (
    <div className={`flex items-center my-3 gap-2 rounded-xl px-4 py-3 transition-all ${box}`}>
      <div onClick={() => toggleTodo(id)} className='flex flex-1 items-center cursor-pointer gap-3'>
        <img className='w-6' src={isCompleted ? tick : not_tick} alt='' />
        <p className={`text-2xl ${isCompleted ? 'line-through opacity-25' : ''}`}>{text}</p>
      </div>
      <img onClick={() => { deleteTodo(id) }} className='w-3.5 cursor-pointer' src={delete_icon} alt='' />
    </div>
  )
}

export default TodoItems