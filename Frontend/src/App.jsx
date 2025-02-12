import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import Register from './Pages/Register'
import Login from './Pages/Login'
import { ToastContainer } from 'react-toastify';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='h-screen w-screen'>
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
      <ToastContainer />
    </div>
  )
}

export default App
