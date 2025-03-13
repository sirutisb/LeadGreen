import NavBar from "../Components/NavBar/NavBar"
import Section from "../Components/Section"
import {motion} from "framer-motion"
import Page from "./Page"
import Footer from "../Components/Footer"
import FAQ from "../Components/FAQ"
import UserFeedBack from "../Components/UserFeedBack"
import ScrollVelocity from "../Components/Effects/ScrollVelocity"
import Scan from "../assets/scan1.svg"
import Point from "../assets/point1.svg"
import Water from "../assets/water2.svg"

const cards = [
  {
    title: "Scan & Post",
    description: "Complete a sustainable activity, scan the QR code, and post a photo of your eco-friendly action.",
    image: Scan 
  },
  {
    title: "Earn Points and Compete",
    description: "Get rewarded with points based on your activity. Compete with others user through leaderboard",
    image: Point 
  },
  {
    title: "Grow Your Plant",
    description: "Spend points to nurture your virtual plant. Watch it grow and unlock new appearances as you level up!",
    image: Water 
  },
]


export default function Home() {
  return (
    <Page className="bg-white">
      <NavBar />
      
      <Section />

      <div className="container mx-auto p-4 relative mb-24" style={{ minHeight: "200x", height: "auto" }}>
          <div className="w-full flex justify-center ">
            <div className="max-w-[1024px] w-full">
              <motion.div
                className="font-serif text-5xl text-center text-black"
                style={{
                  marginTop: "60px",
                  "@media (min-width: 768px)": {
                      marginTop: "90px"
                  }
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                How LeadGreen Works
              </motion.div>
            </div>
          </div>

          <div className="w-full flex justify-center mt-20 mb-10 relative z-1 ">
            <div className="grid grid-cols-1 md:grid-cols-3 max-w-[1024px] mx-auto gap-4 md:gap-8 px-4">
              {cards.map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-6 rounded-2xl shadow-xl"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.4 + index * 0.2 }}
                >
                  <h3 className="text-xl font-semibold mb-2 text-green-700">{feature.title}</h3>
                  <img src={feature.image}  className="w-full h-48 object-contain mb-4 py-4" alt="" />
                  <p className="text-black text-lg font-medium">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

      <ScrollVelocity
        texts={['Lead Green', 'Make Exeter Green Again']} 
        className="custom-scroll-text"
      />

      <UserFeedBack/>
    
      <FAQ/>

      <Footer/>

    </Page>
  )
} 