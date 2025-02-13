import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import Register from './Pages/Register'
import Login from './Pages/Login'
import { ToastContainer } from 'react-toastify';
import Posts from './Pages/Posts'
import Leaderboard from './Pages/Leaderboard'
import Trees from './Pages/Trees'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='h-screen w-screen'>
      <Routes>
        <Route path="/" element={<Leaderboard />} />
      </Routes>
      <ToastContainer />
    </div>
  )
}

export default App
