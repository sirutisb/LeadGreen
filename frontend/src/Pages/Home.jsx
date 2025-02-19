import { ArrowRight, Send, Menu, TreePine, Bird } from "lucide-react"
// import FeatureCard from "../Components/FeatureCard"
import NavBar from "../Components/NavBar/NavBar"
import Section from "../Components/Section"
import earth from "../assets/earth.webp"
import earth2 from "../assets/earth2.svg"
import GreenCircles from "../Components/Circle"
import { useContext } from "react"

import {motion} from "framer-motion"
import Page from "./Page"
import AuthContext from "../Context/AuthContext"

const cards = [
    {title: "Post",
    description: "Share your growth with the university's community.",
    icon: <Send className="h-12 w-12 text-green-600" />,
    link: "/feed"},
    {title: "Leaderboard",
    description: "Track your sustainability rank among your peers.",
    icon: <Menu className="h-12 w-12 text-green-600" />,
    link: "/leaderboards"},
    {title: "Tree",
    description: "Start planting and growing your own tree.",
    icon: <TreePine className="h-12 w-12 text-green-600" />,
    link: "/game"},

]
export default function Home() {
    // let {user, logoutUser} = useContext(AuthContext)
  return (
    <Page className="bg-[#f3f1ea]">
      <Section />

      <div>
        <GreenCircles 
          title="" 
          description="" 
          initialVariant="secondary"
          showVariantToggle={true}
        />
      </div>

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
          <p>&copy; © 2025 Lead Green. All rights reserved.</p>
          <p className="mt-2">Committed to a sustainable future.</p>
          </div>
      </footer>
    </Page>
  )
} 