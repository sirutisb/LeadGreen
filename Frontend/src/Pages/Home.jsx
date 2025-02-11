import { ArrowRight, Send, Menu, TreePine } from "lucide-react"
import FeatureCard from "../components/FeatureCard"
import NavBar from "../Components/Navbar"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <NavBar></NavBar>

      <main className="container mx-auto px-4 py-16">
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-green-700 mb-4">Track Your Sustainability Journey</h1>
          <p className="text-xl text-green-700 mb-8">
            Empower yourself to make eco-friendly choices and reduce your carbon footprint.
          </p>
          <a
            href="#get-started"
            className="inline-flex items-center px-6 py-3 text-lg font-semibold text-white bg-green-600 rounded-full hover:bg-green-700 transition-colors duration-300"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </section>
        
        <section id="features" className="grid md:grid-cols-3 gap-8 mb-16">
          <button 
            onClick={() => alert("Post feature clicked!")} 
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
          >
            <FeatureCard
              icon={<Send className="h-12 w-12 text-green-600" />}
              title="Post"
              description="Share your growth with the university's community."
            />
          </button>

          <button 
            onClick={() => alert("Leaderboard feature clicked!")} 
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
          >
            <FeatureCard
              icon={<Menu className="h-12 w-12 text-green-600" />}
              title="Leaderboard"
              description="Track your sustainability rank among your peers."
            />
          </button>

          <button 
            onClick={() => alert("Tree feature clicked!")} 
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
          >
            <FeatureCard
              icon={<TreePine className="h-12 w-12 text-green-600" />}
              title="Tree"
              description="Start planting and growing your own tree."
            />
          </button>
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
          <p>&copy; 2025 Lead Green. All rights reserved.</p>
          <p className="mt-2">Committed to a sustainable future.</p>
        </div>
      </footer>
    </div>
  )
} 