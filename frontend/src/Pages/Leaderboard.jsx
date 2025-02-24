import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import axios from "axios";
import Page from "./Page";
import NavBar from "../Components/NavBar/NavBar.jsx";
import Footer from "../Components/Footer.jsx";

const API_BASE_URL = "http://127.0.0.1:8000/api/leaderboard";

// State for search input, sorting method, leaderboard data, loading, and errors
const LeaderboardPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("lifetime-points");
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 100;

  // Sorting options for the leaderboard
  const sortOptions = [
    { key: "points", label: "Point Balance" },
    { key: "tree-level", label: "Tree Level" },
    { key: "lifetime-points", label: "Overall Points" },
  ];

  // Fetch leaderboard data whenever the sorting method changes
  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_BASE_URL}/${sortBy}/`);
        setLeaderboardData(response.data.results || []);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch leaderboard data");
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [sortBy]);

  // Filter leaderboard based on the search term
  const filteredLeaderboard = leaderboardData.filter((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredLeaderboard.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredLeaderboard.length / entriesPerPage);

  // Component for rendering each leaderboard row (desktop & mobile view)
  const TableRow = ({ user, index, isMobile }) => {
    if (isMobile) {
      return (
          <div className="p-4 border-b border-gray-200 hover:bg-green-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold text-gray-500">#{indexOfFirstEntry + index + 1}</span>
              <span className="font-semibold text-black">{user.username}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <div className="text-gray-500 mb-1">Points</div>
                <div className="font-bold text-green-600">{user.points_balance}</div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">Tree level</div>
                <div className="font-bold text-green-500">{user.tree_level}</div>
              </div>
              <div>
              <div className="text-right">
                <div className="text-gray-500 mb-1">Overall Points</div>
                <div className="font-bold text-green-700">{user.lifetime_points}</div>
              </div>
              </div>
            </div>
          </div>
      );
    }

    return (
        <div className="grid grid-cols-10 items-center py-3 px-4 hover:bg-green-50 transition duration-300 text-sm border-b border-gray-200">
          <div className="col-span-1 font-bold text-lg text-gray-500">#{indexOfFirstEntry + index + 1}</div>
          <div className="col-span-4 font-semibold text-black text-center">{user.username}</div>
          <div className="col-span-2 text-center font-bold text-green-600">{user.points_balance}</div>
          <div className="col-span-1 text-center font-bold text-green-500">{user.tree_level}</div>
          <div className="col-span-2 text-center font-bold text-green-700">{user.lifetime_points}</div>
        </div>
    );
  };

  return (
      <Page className="bg-gradient-to-b from-green-50 to-green-200">
        <NavBar />
        {/* Hero Section - unchanged */}
        <section className="text-green-700 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Sustainability Leaderboard</h1>
            <p className="text-xl mb-8">Join the movement and make a difference!</p>
            <button className="bg-white text-green-600 font-bold py-2 px-6 rounded-full hover:bg-green-100 transition duration-300">
              Join the Challenge
            </button>
          </div>
        </section>

        {/* Stats Section - unchanged */}
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

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-green-600 mb-8">
              Top Sustainability Champions
            </h2>

            {/* Search and Sort Section - improved mobile layout */}
            <div className="mb-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="relative w-full md:w-auto">
                <input
                    type="text"
                    placeholder="Search participants..."
                    className="w-full md:w-64 pl-10 pr-4 py-2 border-2 border-green-600 rounded-full text-black"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                {sortOptions.map((option) => (
                    <button
                        key={option.key}
                        className={`px-3 py-1 rounded-full text-sm ${
                            sortBy === option.key ? "bg-green-500 text-white" : "bg-gray-200 text-gray-800"
                        } hover:bg-green-500 hover:text-white transition duration-300`}
                        onClick={() => {
                          setSortBy(option.key);
                          setCurrentPage(1);
                        }}
                    >
                      {option.label}
                    </button>
                ))}
              </div>
            </div>

            {/* Current sort indicator */}
            <div className="mb-4 text-sm text-green-700 text-center md:text-left">
              Currently sorted by: {sortOptions.find(opt => opt.key === sortBy)?.label || "Overall Points"}
            </div>

            {/* Leaderboard List - Mobile responsive version */}
                <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                  
                  {/* Desktop Headers - hidden on mobile */}

                  <div className="hidden md:grid grid-cols-10 bg-green-600 text-white py-3 px-4 text-sm">
                    <div className="col-span-1 font-bold ">Rank</div>
                    <div className="col-span-4 font-bold text-center">Participant</div>
                    <div className="col-span-2 font-bold text-center">
                      Point Balance {sortBy === "points" && "▼"}
                    </div>
                    <div className="col-span-1 font-bold text-center">
                      Tree Life {sortBy === "tree-level" && "▼"}
                    </div>
                    <div className="col-span-2 font-bold text-center">
                      Overall Balance {sortBy === "lifetime-points" && "▼"}
                    </div>
                  </div>

                  {/* Responsive Table Content */}
                  {currentEntries.length > 0 ? (
                      currentEntries.map((user, index) => (
                          <TableRow
                              key={user.id}
                              user={user}
                              index={index}
                              isMobile={window.innerWidth < 768}
                          />
                      ))
                  ) : (
                      <div className="py-8 text-center text-gray-500">No results found.</div>
                  )}
                </div>

            {/* Pagination allignement */}
            {currentEntries.length > 0 && (
                <div className="mt-6 flex flex-wrap justify-center items-center gap-4">
                  <button
                      onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-green-500 text-white rounded-full disabled:bg-gray-300 w-28"
                  >
                    Previous
                  </button>
                  <span className="text-green-700">
                Page {currentPage} of {totalPages}
              </span>
                  <button
                      onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-green-500 text-white rounded-full disabled:bg-gray-300 w-28"
                  >
                    Next
                  </button>
                </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-green-600 py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">How it works</h3>
                <p>
                  As you make more sustainable choices around our university campus and contribute
                  to Exeter Universitys sustainability goals, you gradually move up the leaderboard
                  to earn special rewards.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:underline">Home Page</a></li>
                  <li><a href="#" className="hover:underline">Upload your progress now</a></li>
                  <li><a href="#" className="hover:underline">Play the game</a></li>
                </ul>
              </div>
            </div>
            <Footer/>
          </div>
        </footer>
      </Page>
  );
};

export default LeaderboardPage;
