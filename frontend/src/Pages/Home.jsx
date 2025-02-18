"use client"
import { ArrowRight, Send, Menu, TreePine, Bird } from "lucide-react"
import FeatureCard from "../Components/FeatureCard"
import NavBar from "../Components/Navbar/NavBar"
import Section from "../Components/Section"
import earth from "../assets/earth.webp"
import earth2 from "../assets/earth2.svg"

import {motion} from "framer-motion"
const cards = [
    {title: "Post",
    description: "Share your growth with the university's community.",
    icon: <Send className="h-12 w-12 text-green-600" />,
    link: "/posts"},
    {title: "Leaderboard",
    description: "Track your sustainability rank among your peers.",
    icon: <Menu className="h-12 w-12 text-green-600" />,
    link: "/leaderboards"},
    {title: "Tree",
    description: "Start planting and growing your own tree.",
    icon: <TreePine className="h-12 w-12 text-green-600" />,
    link: "/trees"},

]
export default function Home() {
  return (
    <div className="min-h-screen bg-[#f3f1ea]">
      <NavBar />

        <Section></Section>

        <motion.div 
          className="relative w-full mt-12"  
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}>
          <svg
            xmlns = {earth2}
            alt="EcoTrack Dashboard Visualization"
            className="w-full  mx-auto py-16"
            priority
      
          />
          <div
            className="absolute bottom-0 left-0 right-0 w-full"
            style={{
              height: "400px",
              background: "linear-gradient(to top, #DCD5C1 0%, rgba(217, 217, 217, 0) 100%)",
              zIndex: 10,
            }}
          />
        </motion.div>

        <section id="features" className="grid md:grid-cols-3 gap-8 mb-16 py-40">
        {cards.map(e=><FeatureCard icon={e.icon} description={e.description} title={e.title} link={e.link}/>)}
        </section>

        <section className="text-center mb-16">
          <h2 className="text-3xl font-bold text-green-800 mb-4">Join the Green Revolution</h2>
          <p className="text-xl text-green-700 mb-8">
            Together, we've helped users reduce their carbon footprint by over 1 million kg of CO2!
          </p>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-5xl font-bold text-green-600 mb-2">1,000,000+</div>
            <div className="text-green-800">kg of CO2 reduced</div>
          </div>
        </section>

      <footer className="bg-green-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Lead Green. All rights reserved.</p>
          <p className="mt-2">Committed to a sustainable future.</p>
        </div>
      </footer>
    </div>
  )
} 