import { useState, useEffect } from "react";
import axios from "axios";
import { Search } from "lucide-react";
import Page from "./Page";

const API_BASE_URL = "http://127.0.0.1:8000/api/leaderboard";

const LeaderboardPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("lifetime-points");
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;

  const sortOptions = [
    { key: "points", label: "Point Balance" },
    { key: "tree-level", label: "Tree Level" },
    { key: "lifetime-points", label: "Overall Points" },
  ];

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

  const filteredLeaderboard = leaderboardData.filter((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredLeaderboard.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredLeaderboard.length / entriesPerPage);

  return (
      <Page className="min-h-screen bg-gradient-to-b from-green-50 to-green-200">
        <section className="py-8 md:py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-green-600 mb-6 md:mb-8">
              Top Sustainability Champions
            </h2>

            {/* Search and Sort - Mobile Responsive */}
            <div className="mb-6 space-y-4 md:space-y-0 md:flex md:flex-row md:justify-between md:items-center">
              {/* Search - Full width on mobile */}
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

              {/* Sort Buttons - Scrollable on mobile */}
              <div className="flex overflow-x-auto py-2 md:py-0 no-scrollbar">
                <div className="flex space-x-2">
                  {sortOptions.map((option) => (
                      <button
                          key={option.key}
                          className={`whitespace-nowrap px-3 py-1 rounded-full text-sm ${
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
            </div>

            {/* Leaderboard List */}
            {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : (
                <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                  {/* Desktop Header - Hidden on Mobile */}
                  <div className="hidden md:grid grid-cols-10 bg-green-600 text-white py-3 px-4 text-sm">
                    <div className="col-span-1 font-bold">Rank</div>
                    <div className="col-span-4 font-bold">Participant</div>
                    <div className="col-span-2 font-bold text-center">Point Balance</div>
                    <div className="col-span-1 font-bold text-center">Tree Level</div>
                    <div className="col-span-2 font-bold text-center">Overall Points</div>
                  </div>

                  {currentEntries.length > 0 ? (
                      currentEntries.map((user, index) => (
                          <div
                              key={user.id}
                              className="border-b last:border-b-0 hover:bg-green-50 transition duration-300"
                          >
                            {/* Mobile Layout - Card Style */}
                            <div className="md:hidden p-4">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-lg text-gray-500">#{indexOfFirstEntry + index + 1}</span>
                                <span className="font-semibold text-black text-lg">{user.username}</span>
                              </div>
                              <div className="grid grid-cols-3 gap-2 text-sm">
                                <div className="text-center">
                                  <div className="text-xs text-gray-500">Points</div>
                                  <div className="font-bold text-green-600">{user.points_balance}</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-xs text-gray-500">Tree Level</div>
                                  <div className="font-bold text-green-500">{user.tree_level}</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-xs text-gray-500">Overall</div>
                                  <div className="font-bold text-green-700">{user.lifetime_points}</div>
                                </div>
                              </div>
                            </div>

                            {/* Desktop Layout - Table Style */}
                            <div
                                className="hidden md:grid grid-cols-10 items-center py-3 px-4 text-sm"
                            >
                              <div className="col-span-1 font-bold text-lg text-gray-500">{indexOfFirstEntry + index + 1}</div>
                              <div className="col-span-4 font-semibold text-black">{user.username}</div>
                              <div className="col-span-2 text-center font-bold text-green-600">{user.points_balance}</div>
                              <div className="col-span-1 text-center font-bold text-green-500">{user.tree_level}</div>
                              <div className="col-span-2 text-center font-bold text-green-700">{user.lifetime_points}</div>
                            </div>
                          </div>
                      ))
                  ) : (
                      <div className="py-8 text-center text-gray-500">No results found.</div>
                  )}
                </div>
            )}

            {/* Pagination - Mobile Friendly */}
            {currentEntries.length > 0 && (
                <div className="mt-6 flex justify-center items-center space-x-2 md:space-x-4">
                  <button
                      onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-2 md:px-3 py-1 bg-green-500 text-white text-sm rounded-full disabled:bg-gray-300"
                  >
                    Prev
                  </button>
                  <span className="text-sm md:text-base text-green-700">
                {currentPage} / {totalPages}
              </span>
                  <button
                      onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-2 md:px-3 py-1 bg-green-500 text-white text-sm rounded-full disabled:bg-gray-300"
                  >
                    Next
                  </button>
                </div>
            )}
          </div>
        </section>
      </Page>
  );
};

export default LeaderboardPage;