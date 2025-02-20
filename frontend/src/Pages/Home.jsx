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
import Footer from "../Components/Footer"

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
    let {user, logoutUser} = useContext(AuthContext)
  return (
    <Page className="bg-[#f3f1ea]">
      <NavBar/>
      <Section />
    {/* // <Page>
    //     {user && user.username}
    //     {user ? <p onClick={logoutUser}>Log out</p> : <p>Log in</p>} */}
      <div>
        <GreenCircles 
          title="" 
          description="" 
          initialVariant="secondary"
          showVariantToggle={true}
        />
      </div>

      <div className="container mx-auto relative " style={{ height: "887px" }}>
          <div className="w-full flex justify-center">
            <div className="max-w-[1024px] w-full">
              <motion.div
                className="font-serif text-[64px] leading-[70px] text-black"
                style={{
                  marginTop: "181px",
                  width: "391px",
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                Made for Modern
                <br />
                Eco-Conscious People
              </motion.div>
            </div>
          </div>

          <div className="w-full flex justify-center mt-[51px] mb-[187px] relative z-1 ">
            <div className="grid grid-cols-1 md:grid-cols-3 max-w-[1024px] mx-auto gap-8">
              {[
                {
                  title: "Scan & Post",
                  description: "Complete a sustainable activity, scan the QR code, and post a photo of your eco-friendly action.",
                },
                {
                  title: "Earn Points and Compete",
                  description: "Get rewarded with points based on your activity. Compete with others user through leaderboard",
                },
                {
                  title: "Grow Your Plant",
                  description: "Spend points to nurture your virtual plant. Watch it grow and unlock new appearances as you level up!",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-lg"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.4 + index * 0.2 }}
                >
                  <h3 className="text-xl font-semibold mb-2 text-green-700">{feature.title}</h3>
                  <p className="text-black text-lg font-medium">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

      <section className="text-center mb-16">
        <h2 className="text-3xl font-bold text-green-800 mb-4">Join the Green Revolution</h2>
        <p className="text-xl text-green-700 mb-8">
          asd
        </p>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-5xl font-bold text-green-600 mb-2">asd</div>
          <div className="text-green-800">asd</div>
        </div>
      </section>

      <Footer/>
    </Page>
  )
} 