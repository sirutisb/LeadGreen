"use client"
import { useState } from "react"
import { Leaf, TableOfContents, Menu, X } from "lucide-react"
import UserNav from "./UserNav"
import { Link } from "react-router-dom"
import { motion, AnimatePresence, easeIn  } from "framer-motion"
import MobileDropDown from './MobileDropDown';
//na
const navbarVariants = {
  hidden: {opacity: 0, y: -50},
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
}

const linkVariants = {
  hover: {
    scale: 1.1,
    color: "#15803d",
    transition: {type: "spring", stiffness: 300},
  },
}

const mobileMenuVariants = {
  closed: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  open: {
    opacity: 1,
    height: "auto",
    transition:{
      duration: 0.3,
      ease: "easeInOut",
    },
  },
}

export default function NavBar(){
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    {to: "/feed", text: "Feeds"},
    {to: "/leaderboard", text: "Leaderboard"},
    {to: "/game", text: "Game"},
  ]

  return(
    <>
      <motion.div className="flex justify-between items-center py-8 z-50 backdrop-blur-lg shadow-md bg-transparent"
      initial = "hidden"
      animate = "visible"
      variants={navbarVariants}>
        <motion.div className="flex items-center space-x-2 px-8" whileHover={{scale: 1.05}}>
          <Leaf className="h-8 w-8 text-green-600" />
          <Link to={"/"} className="text-2xl font-bold text-green-700">LeadGreen</Link>
        </motion.div>

        {/* Desktop Nav */}
        <div className="hidden md:flex">
          <div className="flex items-center space-x-6 px-8">
            {navLinks.map((link) => (
              <motion.div key={link.to} whileHover="hover" variants={linkVariants}>
                <Link 
                  to={link.to}
                  className="text-2xl font-bold text-green-700">
                    {link.text}
                </Link>
              </motion.div>
            ))}
            <motion.div whileHover="hover" variants={linkVariants}>
              <UserNav/>
            </motion.div>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden px-8">
          <motion.button
            whileHover={{scale: 1.1}}
            whileTap={{scale:0.95}}
            onClick={() => setIsOpen(!isOpen)}
            className="text-green-700"
          >
            {isOpen ? <X size={24}/> : <Menu size ={24} />}
          </motion.button>
        </div>
      </motion.div>
      
      <MobileDropDown 
        isOpen={isOpen}
        setIsOpen = {setIsOpen}
        navLinks={navLinks}
        UserNav={UserNav}/>
    </>
  )
}