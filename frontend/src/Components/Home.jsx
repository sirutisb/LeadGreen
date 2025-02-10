import React from 'react'
import { NavLink } from 'react-router'

function Home() {
  return (
    <NavLink to={"/admin"}>Home</NavLink>
  )
}

export default Home