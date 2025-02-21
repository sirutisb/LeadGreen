"use client"
import { Leaf, TableOfContents } from "lucide-react"
import UserNav from "./UserNav"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
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

export default function NavBar(){
    return(
      <motion.div className="flex justify-between items-center py-8 z-50 backdrop-blur-lg shadow-md bg-transparent"
      initial = "hidden"
      animate = "visible"
      variants={navbarVariants}>
        <motion.div className="flex items-center space-x-2 px-8" whileHover={{scale: 1.05}}>
          <Leaf className="h-8 w-8 text-green-600" />
          <Link to={"/"} className="text-2xl font-bold text-green-700">LeadGreen</Link>
        </motion.div>

        <div className="">
          <div className="flex items-center space-x-6 px-8">
            <motion.div whileHover="hover" variants={linkVariants}>
              <Link to={"/feed"} className="text-2xl font-bold text-green-700">Feeds</Link>
            </motion.div>

            <motion.div whileHover="hover" variants={linkVariants}>
              <Link to={"/leaderboard"} className="text-2xl font-bold text-green-700">Leaderboard</Link>
            </motion.div>

            <motion.div whileHover="hover" variants={linkVariants}>
              <Link to={"/game"} className="text-2xl font-bold text-green-700">Game</Link>
            </motion.div>
            <motion.div whileHover="hover" variants={linkVariants}>
              <UserNav/>
            </motion.div>
          </div>
        </div>
      </motion.div>
    )
}