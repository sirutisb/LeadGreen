import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import { ToastContainer } from 'react-toastify';
import Feed from './Pages/Feed';


function App() {

  return (
    <div className='h-screen w-screen'>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/feed" element={<Feed />} />
        </Routes>
        <ToastContainer />
    </div>
  )
}

export default App
