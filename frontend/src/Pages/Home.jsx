import { ArrowRight, Send, Menu, TreePine, Bird } from "lucide-react"
// import FeatureCard from "../Components/FeatureCard"
import NavBar from "../Components/NavBar/NavBar"
import Section from "../Components/Section"
import earth from "../assets/earth.webp"
import Earth2 from "../assets/earth2.svg"
import GreenCircles from "../Components/Circle"
import { useContext } from "react"
import {motion} from "framer-motion"
import Page from "./Page"
import AuthContext from "../Context/AuthContext"
import Footer from "../Components/Footer"
import FAQ from "../Components/FAQ"
import UserFeedBack from "../Components/UserFeedBack"

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

      <div className="container mx-auto p-4 relative " style={{ minHeight: "600px", height: "auto" }}>
          <div className="w-full flex justify-center ">
            <div className="max-w-[1024px] w-full">
              <motion.div
                className="font-serif text-5xl md:text-[64px] text-center text-black"
                style={{
                  marginTop: "100px",
                  "@media (min-width: 768px)": {
                      marginTop: "181px"
                  }
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                How Lead Green Works
              </motion.div>
            </div>
          </div>

          <div className="w-full flex justify-center mt-8 md:mt-[51px] mb-12 md:mb-[96px] relative z-1 ">
            <div className="grid grid-cols-1 md:grid-cols-3 max-w-[1024px] mx-auto gap-4 md:gap-8 px-4">
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

        <div className="w-full flex justify-center mt-8 md:mt-[51px] mb-12 md:mb-[187px] relative z-1">
            <div className="grid grid-cols-3 max-w-[1024px] mx-auto gap-4 md:gap-8">
              <img
                src= ''
                alt="Banner"
              />
              <img
                src=""
                alt="LLM Powered Banner"
                width={336}
                height={332}
                priority
                className="mx-auto"
              />
              <img
                src=""
                alt="Third Banner"
                width={336}
                height={332}
                priority
                className="mx-auto"
              />
            </div>
          </div>

      <UserFeedBack/>
      <FAQ/>
      <section className="text-center mb-16 px-2">
        <div className="bg-green-100 rounded-lg shadow-lg p-4 md:p-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-green-700 mb-4">Join Lead Green and be part of the solution.</h2>
          <div className="text-3xl md: text-4xl font-bold text-green-700 mb-2 font-serif ">Every small action counts towards a greener future.</div>
          <div className="text-green-800"></div>
        </div>
      </section>

      <Footer/>
    </Page>
  )
} 