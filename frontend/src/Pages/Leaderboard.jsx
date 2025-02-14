import { ArrowLeft, Trophy } from "lucide-react"

// Mock data for the leaderboard
const leaderboardData = [
  { id: 1, name: "A", score: 1250, avatar: "/placeholder.svg?height=40&width=40" },
  { id: 2, name: "B", score: 1180, avatar: "/placeholder.svg?height=40&width=40" },
  { id: 3, name: "C", score: 1050, avatar: "/placeholder.svg?height=40&width=40" },
  { id: 4, name: "D", score: 980, avatar: "/placeholder.svg?height=40&width=40" },
  { id: 5, name: "E", score: 920, avatar: "/placeholder.svg?height=40&width=40" },
]

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <header className="container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-green-800">EcoTrack Leaderboard</h1>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-green-800 mb-6">Top Eco-Warriors</h2>
          <div className="space-y-4">
            {leaderboardData.map((user, index) => (
              <div key={user.id} className="flex items-center justify-between bg-green-50 p-4 rounded-lg">
                <div className="flex items-center space-x-4">
                  <span className="text-2xl font-bold text-green-700">{index + 1}</span>
                  <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="w-10 h-10 rounded-full" />
                  <span className="font-semibold text-green-800">{user.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <span className="font-bold text-green-700">{user.score} points</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="bg-green-800 text-white py-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 EcoTrack. All rights reserved.</p>
          <p className="mt-2">Committed to a sustainable future.</p>
        </div>
      </footer>
    </div>
  )
}

