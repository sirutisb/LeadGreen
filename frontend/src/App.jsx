import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import Register from './Pages/Register'
import Login from './Pages/Login'
import { ToastContainer } from 'react-toastify';

import Leaderboard from './Pages/Leaderboard'
import FeedPage from './Pages/FeedPage';
import OverLeafPage from './Pages/OverLeafPage';


function App() {

  return (
    <div className='h-screen w-screen'>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/leaderboards" element={<Leaderboard />} />
        <Route path="/game" element={<OverLeafPage />} />

      </Routes>
      <ToastContainer />
    </div>
  )
}

export default App
