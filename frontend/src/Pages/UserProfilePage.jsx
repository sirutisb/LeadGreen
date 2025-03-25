"use client"

import { useState, useContext, useEffect } from "react"
import { motion } from "framer-motion"
import { User, Settings, Award, Leaf, TreePine, Calendar, TrendingUp, Edit, Camera, LogOut } from "lucide-react"
import NavBar from "../Components/NavBar/NavBar"
import Footer from "../Components/Footer"
import Page from "./Page"
import AuthContext from "../Context/AuthContext"
import userService from "../Hooks/userService"
import { useParams } from "react-router-dom"
import { Link } from "react-router-dom"
import { Typography, Box } from "@mui/material"
import { toastSuccess, toastError } from "../Components/utils/toastCustom"

export default function UserProfile() {
  const { user, logoutUser } = useContext(AuthContext)
  const { userId } = useParams()// Get userId from URL if viewing other users
  const [activeTab, setActiveTab] = useState("overview")
  const [profileData, setProfileData] = useState(null)
  const [error, setError] = useState(null)
  const [userPosts, setUserPosts] = useState([])
  const [postsPage, setPostsPage] = useState(1)
  const [hasMorePosts, setHasMorePosts] = useState(true)
  const [loadingMorePosts, setLoadingMorePosts] = useState(false)

  // Determine which user profile to load
  const profileId = userId || (user && user.id)
  const isOwnProfile = !userId || (user && userId === user.id)

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!profileId) return
        try{
          const data = await userService.getUserProfile(profileId)
          setProfileData(data)
          setError(null)
        } catch(err){
          console.error("Failed to fetch profile data: ", err)
          setError("Failed to load profile!")
        }
    }

    fetchProfileData()
  }, [profileId])

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!profileId) return
        try {
          const data = await userService.getUserPosts(profileId, 1)
          setUserPosts(data.results)
          setHasMorePosts(!!data.next)
        } catch (err) {
          console.error("Failed to fetch user posts:", err)
        }
    }

    fetchUserPosts()
  }, [profileId])

  // Load more posts
  const loadMorePosts = async () => {
    if (loadingMorePosts || !hasMorePosts) return

    setLoadingMorePosts(true)
    try {
      const nextPage = postsPage + 1
      const data = await userService.getUserPosts(profileId, nextPage)

      setUserPosts((prev) => [...prev, ...data.results])
      setPostsPage(nextPage)
      setHasMorePosts(!!data.next)
    } catch (err) {
      console.error("Failed to load more posts:", err)
    } finally {
      setLoadingMorePosts(false)
    }
  }

  // Handle profile picture upload
  const handleProfilePictureUpload = async (e) => {
    if (!isOwnProfile) return

    const file = e.target.files[0]
    if (!file) return

    try {
      const formData = new FormData()
      formData.append('profile_picture', file)

      await userService.uploadProfilePicture(formData)
      window.location.reload() // Refresh the page after successful upload
    } catch (err) {
      console.error("Failed to upload profile picture:", err)
      toastError(err.response?.data?.error || "Failed to upload profile picture. Please try again.")
    }
  }

  if (error) {
    return (
      <Page className="bg-[#f3f1ea]">
        <NavBar />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="bg-red-50 text-red-700 p-4 rounded-lg inline-block">
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
        <Footer />
      </Page>
    )
  }

  if (!profileData) {
    return (
      <Page className="bg-[#f3f1ea]">
        <NavBar />
        <div className="container mx-auto px-4 py-20 text-center">
          <p>User not found</p>
        </div>
        <Footer />
      </Page>
    )
  }


  const userData = {
    name: profileData.user.username,
    joinDate: "Member since 2025", 
    bio: "Environmental enthusiast and sustainability advocate.", 
    location: "Exeter, UK",
    points: profileData.user.points_balance,
    rank: profileData.rank,
    treeLevel: profileData.game_profile.tree_level,
    treeName: profileData.game_profile.current_plant.name,
    treeGrowth: profileData.game_profile.tree_growth,
    currentPlant: profileData.game_profile.current_plant,
    currentInsect: profileData.game_profile.current_insect,
    spins: profileData.game_profile.spins,
    badges: [
      { name: "Early Adopter", icon: <Award className="h-6 w-6" /> },
      { name: "Tree Hugger", icon: <TreePine className="h-6 w-6" /> },
      { name: "Eco Warrior", icon: <Leaf className="h-6 w-6" /> },
    ],
    stats: [
      { label: "Posts", value: profileData.posts.length },
      { label: "Points", value: profileData.user.points_balance },
      { label: "CO₂ Saved", value: `${Math.floor(profileData.user.points_balance / 31.4)}kg` },
      { label: "Spins", value: profileData.game_profile.spins },
    ],
    recentActivity: profileData.posts.slice(0, 4).map((post) => ({
      action: post.caption,
      date: new Date(post.created_at).toLocaleDateString(),
      points: post.points_received,
    })),
  }

  return (
    <Page className="bg-[#f3f1ea]">
      <NavBar />

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Profile Header */}
        <motion.div
          className="bg-white rounded-xl shadow-lg overflow-hidden mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Cover Photo */}
          <div className="h-48 bg-gradient-to-r from-green-400 to-green-600 relative">
          </div>

          <div className="px-6 py-4 md:px-8 md:py-6 flex flex-col md:flex-row gap-6 relative">
            {/* Profile Picture */}
            <div className="relative -mt-20 md:-mt-24">
              <div className="relative h-24 w-24 md:h-32 md:w-32 rounded-full border-4 border-white bg-green-100 flex items-center justify-center overflow-hidden">
                {profileData.user.profile_picture ? (
                  <img
                    src={profileData.user.profile_picture}
                    alt={`${profileData.user.username}'s profile`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-16 w-16 md:h-20 md:w-20 text-green-600" />
                )}
                {isOwnProfile && (
                  <label
                    htmlFor="profile-upload"
                    className="absolute inset-0 rounded-full bg-black bg-opacity-60 flex items-center justify-center opacity-0 hover:opacity-60 transition-opacity cursor-pointer"
                  >
                    <Edit className="h-5 w-5 text-white" />
                    <input
                      id="profile-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfilePictureUpload}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-serif font-bold text-black">{userData.name}</h1>
                  <p className="text-gray-500 flex items-center gap-1 mt-1">
                    <Calendar className="h-4 w-4" /> Joined {userData.joinDate}
                  </p>
                </div>

                {isOwnProfile && (
                <div className="flex gap-3 mt-4 md:mt-0">
                  <label
                    htmlFor="profile-upload"
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors cursor-pointer"
                  >
                    <Settings className="h-4 w-4" /> Edit Profile
                    <input
                      id="profile-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfilePictureUpload}
                    />
                  </label>
                  <button
                    onClick={logoutUser}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" /> Log Out
                  </button>
                </div>
                )}
              </div>

              <p className="mt-4 text-gray-600">{userData.bio}</p>

              <div className="mt-6 flex flex-wrap gap-4">
                {userData.badges.map((badge, index) => (
                  <div key={index} className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full">
                    <span className="text-green-600">{badge.icon}</span>
                    <span className="text-sm font-medium text-green-800">{badge.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
        <button
            className={`px-4 py-2 font-medium ${activeTab === "overview" ? "text-green-600 border-b-2 border-green-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === "post" ? "text-green-600 border-b-2 border-green-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setActiveTab("post")}
          >
            Post
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="md:col-span-2">
            {activeTab === "overview" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  {userData.stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md p-4 text-center">
                      <p className="text-gray-500 text-sm">{stat.label}</p>
                      <p className="text-2xl font-bold text-green-700 mt-1">{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* Sustainability Tips */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-serif font-bold mb-4 flex items-center gap-2 text-black">
                    <Leaf className="h-5 w-5 text-green-600" /> Sustainability Tips
                  </h2>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-green-800 font-medium">Tip of the Day</p>
                    <p className="mt-2 text-gray-700">
                      Try using a reusable water bottle instead of buying plastic bottles. This small change can prevent
                      hundreds of plastic bottles from ending up in landfills each year.
                    </p>
                  </div>
                </div>

              {/* Tree */}
              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-lg shadow-md p-6 mt-8"
                >
                  <div className="text-center mb-8">
                    <h2 className="text-xl font-serif font-bold mb-2">My Virtual Tree</h2>
                    <p className="text-gray-600">
                      Meet {userData.treeName}, your level {userData.treeLevel} tree!
                    </p>
                  </div>

                  <div className="flex justify-center mb-8">
                    <div className="relative">
                      <div className="h-64 w-64 bg-green-50 rounded-full flex items-center justify-center">
                        {userData.currentPlant && (
                          <img 
                            src={userData.currentPlant.image} 
                            alt={userData.currentPlant.name}
                            className="h-32 w-32 object-contain"
                          />
                        )}
                      </div>
                      <div className="absolute -top-2 -right-2 bg-green-600 text-white h-10 w-10 rounded-full flex items-center justify-center font-bold">
                        Lv.{userData.treeLevel}
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="font-medium text-gray-700 mb-2">Growth Progress</h3>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-green-600 h-4 rounded-full"
                        style={{
                          width: `${(userData.treeGrowth) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-2 text-sm text-gray-600">
                      <span>Current: {Math.round((userData.treeGrowth) * 100)}%</span>
                      <span>Next Level: {Math.round(100 - ((userData.treeGrowth) * 100))}%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-green-50 rounded-lg p-4">
                      <h3 className="font-medium text-green-800 mb-2">Tree Benefits</h3>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-center gap-2">
                          <Leaf className="h-4 w-4 text-green-600" />
                          Absorbs CO₂: {userData.treeLevel * 5}kg per year
                        </li>
                        <li className="flex items-center gap-2">
                          <Leaf className="h-4 w-4 text-green-600" />
                          Produces oxygen for {userData.treeLevel} people
                        </li>
                        <li className="flex items-center gap-2">
                          <Leaf className="h-4 w-4 text-green-600" />
                          Habitat for {userData.treeLevel * 2} virtual wildlife species
                        </li>
                      </ul>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4">
                      <h3 className="font-medium text-green-800 mb-2">Upcoming Rewards</h3>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-green-600" />
                          Level {userData.treeLevel + 1}: New tree appearance
                        </li>
                        <li className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-green-600" />
                          Level {userData.treeLevel + 3}: Unlock garden background
                        </li>
                        <li className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-green-600" />
                          Level 10: Special "Forest Guardian" badge
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Post Tab */}
            {activeTab === "post" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-xl font-serif font-bold mb-6 text-black">Post History</h2>

              {userPosts.length > 0 ? (
                <div className="space-y-6">
                  {userPosts.map((post, index) => (
                    <div
                      key={post.id || index}
                      className="flex gap-4 border-b border-gray-100 pb-6 last:border-0 last:pb-0"
                    >
                      <div className="bg-green-100 h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Leaf className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-black">{post.caption}</p>
                            <p className="text-sm text-gray-500 mt-1">
                              {new Date(post.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="bg-green-50 px-2 py-1 rounded-full text-sm font-medium text-green-700">
                            +{post.points_received} pts
                          </div>
                        </div>
                        {post.image && (
                          <div className="mt-4 rounded-lg overflow-hidden">
                            <img
                              src={post.image}
                              alt="Post content"
                              className="w-full h-auto object-cover"
                            />
                          </div>
                        )}
                        <div className="mt-4 flex items-center gap-4">
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: '#1B6630',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                              }}
                            >
                              <span>❤️</span> {post.likes_count || 0} {post.likes_count === 1 ? 'like' : 'likes'}
                            </Typography>
                          </Box>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No post found.</p>
              )}

              {hasMorePosts && (
                <div className="mt-6 text-center">
                  <button
                    onClick={loadMorePosts}
                    disabled={loadingMorePosts}
                    className="px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    {loadingMorePosts ? "Loading..." : "Load More"}
                  </button>
                </div>
              )}
            </motion.div>
            )}
          </div>

          {/* Right Column */}
          <div>
            {/* Rank Card */}
            <motion.div
              className="bg-white rounded-lg shadow-md p-6 mb-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-xl font-serif font-bold mb-4 flex items-center gap-2 text-black">
                <TrendingUp className="h-5 w-5 text-green-600" /> Your Rank
              </h2>
              <div className="text-center py-4">
                <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-4">
                  <span className="text-3xl font-bold text-green-700">#{userData.rank}</span>
                </div>
                <p className="text-gray-600 mt-4">
                  {userData.rank === 1 
                    ? "🏆 You're the #1 Eco-Warrior! Amazing job! 🌟" 
                    : userData.rank === 2
                    ? "🥈 You're the #2 Eco-Warrior! Incredible achievement! 🌟"
                    : userData.rank === 3
                    ? "🥉 You're the #3 Eco-Warrior! Outstanding work! 🌟"
                    : userData.rank <= 5
                    ? "🌟 You're in the top 5 eco-warriors! Phenomenal! 🌟"
                    : userData.rank <= 10
                    ? "🌱 You're in the top 10 eco-warriors! Fantastic! ✨"
                    : "🌳 Keep growing to climb the ranks! You're doing great! 🌳"}
                </p>
              </div>
              <div className="mt-4">
                <Link 
                  className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  to="/leaderboard"
                >
                  <TrendingUp className="h-4 w-4" />
                  View Leaderboard
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </Page>
  )
}

