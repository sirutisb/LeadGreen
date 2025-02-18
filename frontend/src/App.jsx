import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import { ToastContainer } from 'react-toastify';

import Leaderboard from './Pages/Leaderboard'
import FeedPage from './Pages/FeedPage';
import OverLeafPage from './Pages/OverLeafPage';
import RegisterPage from './Pages/Register'
import LoginPage from './Pages/LoginPage';


function App() {

  return (
    <div className='h-screen w-screen'>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/leaderboards" element={<Leaderboard />} />
        <Route path="/game" element={<OverLeafPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

      </Routes>
      <ToastContainer />
    </div>
  )
}

export default App
