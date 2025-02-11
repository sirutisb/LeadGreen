import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import { ToastContainer } from 'react-toastify';
import Posts from './Pages/Posts'
import Leaderboard from './Pages/Leaderboard'
import Trees from './Pages/Trees'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='h-screen w-screen'>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/trees" element={<Trees />} />
      </Routes>
      <ToastContainer />
    </div>
  )
}

export default App
