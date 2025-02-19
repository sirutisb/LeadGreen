import React from 'react'
import NavBar from '../Components/NavBar/NavBar'

function Page({children, ...props}) {
  return (
    <div {...props}>
        {children}
    </div>
  )
}

export default Page