import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import { ToastContainer } from 'react-toastify';
import FeedPage from './Pages/FeedPage';
import Feed from './Components/Feed';


function App() {

  return (
    <div className='h-screen w-screen overflow-x-hidden'>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/feed" element={<FeedPage />} />
        </Routes>
        <ToastContainer />
    </div>
  )
}

export default App
