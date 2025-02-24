
import { useState, useEffect } from "react";
import { Search, ChevronUp, ChevronDown, Award } from "lucide-react";
import axios from "axios";
import Page from "./Page";
import NavBar from "../Components/NavBar/NavBar.jsx";
import Footer from "../Components/Footer.jsx";

const API_BASE_URL = import.meta.env.VITE_BACKEND+"/api/leaderboard";

const LeaderboardPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("lifetime-points");
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});
  const entriesPerPage = 10;

  // Sorting options for the leaderboard
  const sortOptions = [
    { key: "points", label: "Point Balance" },
    { key: "tree-level", label: "Tree Level" },
    { key: "lifetime-points", label: "Overall Points" },
  ];

  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

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

  // Toggle expanded row
  const toggleExpandRow = (userId) => {
    setExpandedRows(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  // Filter leaderboard based on the search term
  const filteredLeaderboard = leaderboardData.filter((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredLeaderboard.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredLeaderboard.length / entriesPerPage);

  // Get medal color based on rank
  const getMedalColor = (rank) => {
    if (rank === 1) return "text-yellow-500";
    if (rank === 2) return "text-gray-400";
    if (rank === 3) return "text-amber-600";
    return "text-green-600";
  };

  // Component for mobile leaderboard row
  const MobileTableRow = ({ user, index }) => {
    const rank = indexOfFirstEntry + index + 1;
    const isExpanded = expandedRows[user.id];
    const isTopThree = rank <= 3;
    
    return (
      <div 
        className={`relative overflow-hidden mb-3 rounded-xl shadow-md transition-all duration-300 ${
          isExpanded ? "bg-green-50" : "bg-white"
        } ${isTopThree ? "border-l-4 border-green-500" : ""}`}
        style={{
          transform: `translateY(${isExpanded ? "0" : "0"}px)`,
          opacity: 1,
          animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`
        }}
      >
        <div 
          onClick={() => toggleExpandRow(user.id)} 
          className="flex items-center justify-between p-4 cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            {/* Rank with medal for top 3 */}
            <div className="relative flex items-center justify-center w-10 h-10">
              {isTopThree ? (
                <Award className={`w-8 h-8 ${getMedalColor(rank)}`} />
              ) : (
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-700 font-bold">
                  {rank}
                </div>
              )}
            </div>
            
            {/* Username */}
            <div>
              <span className="font-semibold text-gray-800">{user.username}</span>
              <div className="text-xs text-gray-500">
                Level {user.tree_level} Tree
              </div>
            </div>
          </div>
          
          {/* Points and expand icon */}
          <div className="flex items-center">
            <div className="text-right mr-2">
              <div className="font-bold text-green-600">{user.points_balance}</div>
              <div className="text-xs text-gray-500">points</div>
            </div>
            
            {isExpanded ? 
              <ChevronUp className="w-5 h-5 text-gray-400" /> : 
              <ChevronDown className="w-5 h-5 text-gray-400" />
            }
          </div>
        </div>
        
        {/* Expanded view */}
        <div 
          className={`px-4 pb-4 pt-0 transition-all duration-300 ease-in-out overflow-hidden ${
            isExpanded ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="h-px bg-gray-200 mb-3 w-full"></div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <div className="text-xs text-gray-500 mb-1">Current Points</div>
              <div className="font-bold text-xl text-green-600">{user.points_balance}</div>
            </div>
            
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <div className="text-xs text-gray-500 mb-1">Overall Points</div>
              <div className="font-bold text-xl text-green-700">{user.lifetime_points}</div>
            </div>
          </div>
          
          {/* Tree level visual indicator */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Tree Level</span>
              <span>{user.tree_level}/60</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(user.tree_level / 60) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Component for desktop table row
  const DesktopTableRow = ({ user, index }) => {
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
      
      {/* Hero Section */}
      <section className="text-green-700 py-12 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Sustainability Leaderboard</h1>
          <p className="text-lg md:text-xl mb-8">Join the movement and make a difference!</p>
          <button className="bg-white text-green-600 font-bold py-2 px-6 rounded-full hover:bg-green-100 transition duration-300 shadow-md transform hover:scale-105">
            Join the Challenge
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center bg-white rounded-xl shadow-md p-4 transform transition-all duration-300 hover:translate-y-1 hover:shadow-lg">
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">1,234</div>
              <div className="text-gray-600">Active Participants</div>
            </div>
            <div className="text-center bg-white rounded-xl shadow-md p-4 transform transition-all duration-300 hover:translate-y-1 hover:shadow-lg">
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">56,789</div>
              <div className="text-gray-600">Total Tree Score</div>
            </div>
            <div className="text-center bg-white rounded-xl shadow-md p-4 transform transition-all duration-300 hover:translate-y-1 hover:shadow-lg">
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">98,765</div>
              <div className="text-gray-600">kg CO₂ Saved</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-green-600 mb-8">
            Top Sustainability Champions
          </h2>

          {/* Search and Sort Section */}
          <div className="mb-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="relative w-full md:w-auto">
              <input
                type="text"
                placeholder="Search participants..."
                className="w-full md:w-64 pl-10 pr-4 py-2 border-2 border-green-600 rounded-full text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
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
                  className={`px-3 py-1 rounded-full text-sm transition duration-300 transform hover:scale-105 ${
                    sortBy === option.key 
                      ? "bg-green-500 text-white shadow-md" 
                      : "bg-gray-200 text-gray-800 hover:bg-green-100"
                  }`}
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

          {/* Leaderboard List */}
          <div className={`${!isMobile ? "bg-white rounded-lg shadow-xl overflow-hidden" : ""}`}>
            {/* Desktop Headers */}
            {!isMobile && (
              <div className="hidden md:grid grid-cols-10 bg-green-600 text-white py-3 px-4 text-sm">
                <div className="col-span-1 font-bold">Rank</div>
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
            )}

            {/* Loading state */}
            {loading && (
              <div className="py-12 text-center">
                <div className="inline-block w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                <p className="mt-3 text-green-600">Loading leaderboard...</p>
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="py-8 text-center text-red-500 bg-white rounded-lg shadow-lg p-4 m-4">
                <p>Sorry, there was an error loading the leaderboard.</p>
                <p className="text-sm mt-2">{error}</p>
              </div>
            )}

            {/* Responsive Table Content */}
            {!loading && !error && currentEntries.length > 0 ? (
              <div className={`${isMobile ? "space-y-2 px-2" : ""}`}>
                {currentEntries.map((user, index) => (
                  isMobile ? (
                    <MobileTableRow key={user.id} user={user} index={index} />
                  ) : (
                    <DesktopTableRow key={user.id} user={user} index={index} />
                  )
                ))}
              </div>
            ) : (
              !loading && !error && (
                <div className="py-8 text-center text-gray-500">No results found.</div>
              )
            )}
          </div>

        {/* Pagination - Improved mobile layout */}
        {currentEntries.length > 0 && (
          <div className="mt-8 px-4">
            <div className="flex justify-between items-center max-w-md mx-auto">
              <button
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-green-100 text-green-600 font-medium rounded-full disabled:bg-gray-200 disabled:text-gray-400 shadow-sm transition-all duration-300 w-24 text-center"
              >
                Previous
              </button>
              
              <div className="bg-white text-green-700 px-4 py-2 rounded-full shadow-sm text-sm font-medium">
                Page {currentPage} of {totalPages}
              </div>
              
              <button
                onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-green-100 text-green-600 font-medium rounded-full disabled:bg-gray-200 disabled:text-gray-400 shadow-sm transition-all duration-300 w-24 text-center"
              >
                Next
              </button>
            </div>
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
                to Exeter University's sustainability goals, you gradually move up the leaderboard
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

      {/* Add CSS keyframes for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Page>
  );
};

export default LeaderboardPage;