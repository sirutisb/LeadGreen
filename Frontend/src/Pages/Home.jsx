import { Send, Menu, TreePine } from "lucide-react"
import FeatureCard from "../Components/FeatureCard"
import NavBar from "../Components/NavBar"

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
    link: "/posts"},

]
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <NavBar />

      <main className="container mx-auto px-4 py-16">
        <Section></Section>
        
        <section id="features" className="grid md:grid-cols-3 gap-8 mb-16">
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
      </main>

      <footer className="bg-green-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; © 2025 Lead Green. All rights reserved.</p>
          <p className="mt-2">Committed to a sustainable future.</p>
        </div>
      </footer>
    </div>
  )
} 