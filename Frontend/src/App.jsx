import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import { ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Feed from './Pages/Feed';

const queryClient = new QueryClient();
function App() {

  return (
    <div className='h-screen w-screen'>
        <QueryClientProvider client={queryClient}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/feed" element={<Feed />} />
            </Routes>
            <ToastContainer />
        </QueryClientProvider>
    </div>
  )
}

export default App
