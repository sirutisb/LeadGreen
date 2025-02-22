import { useState } from "react"
import NavBar from "../Components/NavBar/NavBar";
import { Search } from "lucide-react"
import Page from "./Page";
import Footer from "../Components/Footer";

// Mock data for the leaderboard
const leaderboardData = [
  { id: 1, name: "Suraj", avatar: "/placeholder.svg?height=50&width=50", score: 1250, trend: "up", badge: "🏆" },
  { id: 2, name: "Thomas", score: 1100, badge: "🌱" },
  { id: 3, name: "Henry", score: 950, badge: "♻️" },
  { id: 4, name: "Ben", score: 900, badge: "🌍" },
  { id: 5, name: "Taha", score: 850, badge: "🌟" },
  { id: 6, name: "Spud", score: 800, badge: "💡" },
  { id: 7, name: "Jed", score: 750, badge: "🗑️" },
  { id: 8, name: "pagetestmockuser1", score: 700, badge: "🔋" },
  { id: 9, name: "pagetestmockuser2", score: 650, badge: "🌿" },
  { id: 10, name: "pagetestmockuser3", score: 600, badge: "🌞" },
  { id: 11, name: "pagetestmockuser4", score: 550, badge: "💧" },
  { id: 12, name: "pagetestmockuser5", score: 500, badge: "🌊" }
];

const LeaderboardPage = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const entriesPerPage = 10

  const filteredLeaderboard = leaderboardData.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const indexOfLastEntry = currentPage * entriesPerPage
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage
  const currentEntries = filteredLeaderboard.slice(indexOfFirstEntry, indexOfLastEntry)

  const totalPages = Math.ceil(filteredLeaderboard.length / entriesPerPage)

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  return (
    <Page className="min-h-screen bg-gradient-to-b from-green-50 to-green-200">
      {/* Hero Section */}
      <section className="text-green-700 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Sustainability Leaderboard</h1>
          <p className="text-xl mb-8">Join the movement and make a difference!</p>
          <button className="bg-white text-green-600 font-bold py-2 px-6 rounded-full hover:bg-green-100 transition duration-300">
            Join the Challenge
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">1,234</div>
              <div className="text-gray-600">Active Participants</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">56,789</div>
              <div className="text-gray-600">Total Tree Score</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">98,765</div>
              <div className="text-gray-600">kg CO₂ Saved</div>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-green-600 mb-8">Top Sustainability Champions</h2>

          {/* Search and Tabs */}
          <div className="mb-6 flex flex-col md:flex-row justify-between items-center">
            <div className="relative mb-4 md:mb-0 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search participants..."
                className="w-full md:w-64 pl-10 pr-4 py-2 border-2 border-green-600 rounded-full ring-2 ring-green-200 text-black placeholder:text-gray-500 focus:border-green-400 focus:ring-green-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <div className="flex space-x-2">
              {["all", "weekly", "monthly"].map((tab) => (
                <button
                  key={tab}
                  className={`px-3 py-1 rounded-full text-sm ${
                    activeTab === tab ? "bg-green-500 text-white" : "bg-gray-200 text-gray-800"
                  } hover:bg-green-500 hover:text-white transition duration-300`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>


          {/* Leaderboard List */}
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="grid grid-cols-10 bg-green-600 text-white py-3 px-4 text-sm">
              <div className="col-span-1 font-bold">Rank</div>
              <div className="col-span-5 font-bold">Participant</div>
              <div className="col-span-2 font-bold text-center">Badge</div>
              <div className="col-span-2 font-bold text-center">Score</div>
            </div>
            {currentEntries.map((user, index) => (
              <div
                key={user.id}
                className="grid grid-cols-10 items-center py-3 px-4 hover:bg-green-50 transition duration-300 text-sm"
              >
                <div className="col-span-1 font-bold text-lg text-gray-500">{indexOfFirstEntry + index + 1}</div>
                <div className="col-span-5 font-semibold text-black">{user.name}</div>
                <div className="col-span-2 text-center text-xl">{user.badge}</div>
                <div className="col-span-2 text-center font-bold text-green-600">{user.score}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-center items-center space-x-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-green-500 text-white rounded-full disabled:bg-gray-300"
            >
              Previous
            </button>
            <span className="text-green-700">
              Page {currentPage} of {Math.ceil(filteredLeaderboard.length / entriesPerPage)}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(filteredLeaderboard.length / entriesPerPage)))
              }
              disabled={currentPage === Math.ceil(filteredLeaderboard.length / entriesPerPage)}
              className="px-3 py-1 bg-green-500 text-white rounded-full disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer/>
    </Page>

  );
};

export default LeaderboardPage;