"use client"

import { useState, useContext } from "react"
import { motion } from "framer-motion"
import { User, Settings, Award, Leaf, TreePine, Calendar, TrendingUp, Edit, Camera, LogOut } from "lucide-react"
import NavBar from "../Components/NavBar/NavBar"
import Footer from "../Components/Footer"
import Page from "./Page"
import AuthContext from "../Context/AuthContext"

export default function UserProfile() {
  const { user, logoutUser } = useContext(AuthContext)

  // Mock data - replace with actual data from your backend
  const userData = {
    name: user?.username || "Jane Green",
    joinDate: "March 2023",
    bio: "Environmental enthusiast and sustainability advocate. Working towards a greener future one action at a time.",
    location: "San Francisco, CA",
    points: 1250,
    rank: 15,
    treeLevel: 4,
    treeName: "Oakley",
    badges: [
      { name: "Early Adopter", icon: <Award className="h-6 w-6" /> },
      { name: "Tree Hugger", icon: <TreePine className="h-6 w-6" /> },
      { name: "Eco Warrior", icon: <Leaf className="h-6 w-6" /> },
    ],
    stats: [
      { label: "Actions", value: 47 },
      { label: "Points", value: 1250 },
      { label: "CO₂ Saved", value: "125kg" },
    ],
    recentActivity: [
      { action: "Recycled paper waste", date: "2 days ago", points: 15 },
      { action: "Used public transport", date: "3 days ago", points: 20 },
      { action: "Planted a tree", date: "1 week ago", points: 100 },
      { action: "Reduced water usage", date: "2 weeks ago", points: 25 },
    ],
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
            <button className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md">
              <Camera className="h-5 w-5 text-green-600" />
            </button>
          </div>

          <div className="px-6 py-4 md:px-8 md:py-6 flex flex-col md:flex-row gap-6 relative">
            {/* Profile Picture */}
            <div className="relative -mt-20 md:-mt-24">
              <div className="h-24 w-24 md:h-32 md:w-32 rounded-full border-4 border-white bg-green-100 flex items-center justify-center overflow-hidden">
                <User className="h-16 w-16 md:h-20 md:w-20 text-green-600" />
              </div>
              <button className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md">
                <Edit className="h-4 w-4 text-green-600" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-serif font-bold">{userData.name}</h1>
                  <p className="text-gray-500 flex items-center gap-1 mt-1">
                    <Calendar className="h-4 w-4" /> Joined {userData.joinDate}
                  </p>
                </div>

                <div className="flex gap-3 mt-4 md:mt-0">
                  <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors">
                    <Settings className="h-4 w-4" /> Edit Profile
                  </button>
                  <button
                    onClick={logoutUser}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" /> Log Out
                  </button>
                </div>
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
          <button className="px-4 py-2 font-medium text-green-600 border-b-2 border-green-600">
            Overview
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="md:col-span-2">
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

                {/* Recent Activity
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                  <h2 className="text-xl font-serif font-bold mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-green-600" /> Recent Activity
                  </h2>
                  <div className="space-y-4">
                    {userData.recentActivity.map((activity, index) => (
                      <div key={index} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{activity.action}</p>
                            <p className="text-sm text-gray-500">{activity.date}</p>
                          </div>
                          <div className="bg-green-50 px-2 py-1 rounded-full text-sm font-medium text-green-700">
                            +{activity.points} pts
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div> */}

                {/* Sustainability Tips */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-serif font-bold mb-4 flex items-center gap-2">
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
              </motion.div>

            {/* {activeTab === "activity" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <h2 className="text-xl font-serif font-bold mb-6">Activity History</h2>

                <div className="space-y-6">
                  {[...userData.recentActivity, ...userData.recentActivity].map((activity, index) => (
                    <div key={index} className="flex gap-4 border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                      <div className="bg-green-100 h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Leaf className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{activity.action}</p>
                            <p className="text-sm text-gray-500 mt-1">{activity.date}</p>
                          </div>
                          <div className="bg-green-50 px-2 py-1 rounded-full text-sm font-medium text-green-700">
                            +{activity.points} pts
                          </div>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <button className="text-sm text-gray-500 hover:text-gray-700">Like</button>
                          <span className="text-gray-300">•</span>
                          <button className="text-sm text-gray-500 hover:text-gray-700">Comment</button>
                          <span className="text-gray-300">•</span>
                          <button className="text-sm text-gray-500 hover:text-gray-700">Share</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )} */}

          
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
                    <TreePine className="h-32 w-32 text-green-600" />
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
                    style={{ width: `${(userData.points % 500) / 5}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>Current: {userData.points % 500} pts</span>
                  <span>Next Level: 500 pts</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-medium text-green-800 mb-2">Tree Benefits</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <Leaf className="h-4 w-4 text-green-600" />
                      Absorbs CO₂: 25kg per year
                    </li>
                    <li className="flex items-center gap-2">
                      <Leaf className="h-4 w-4 text-green-600" />
                      Produces oxygen for 2 people
                    </li>
                    <li className="flex items-center gap-2">
                      <Leaf className="h-4 w-4 text-green-600" />
                      Habitat for 5 virtual wildlife species
                    </li>
                  </ul>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-medium text-green-800 mb-2">Upcoming Rewards</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-green-600" />
                      Level 5: New tree appearance
                    </li>
                    <li className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-green-600" />
                      Level 7: Unlock garden background
                    </li>
                    <li className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-green-600" />
                      Level 10: Special "Forest Guardian" badge
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
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
              <h2 className="text-xl font-serif font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" /> Your Rank
              </h2>
              <div className="text-center py-4">
                <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-4">
                  <span className="text-3xl font-bold text-green-700">#{userData.rank}</span>
                </div>
                <p className="text-gray-600">You're in the top 5% of eco-warriors!</p>
              </div>
              <div className="mt-4">
                <button className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  View Leaderboard
                </button>
              </div>
            </motion.div>

            {/* Upcoming Events */}
            {/* <motion.div
              className="bg-white rounded-lg shadow-md p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-xl font-serif font-bold mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" /> Upcoming Events
              </h2>
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-4">
                  <p className="font-medium">Campus Clean-up Day</p>
                  <p className="text-sm text-gray-500 mt-1">This Saturday, 10:00 AM</p>
                  <div className="mt-2">
                    <span className="inline-block bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full">
                      +100 bonus points
                    </span>
                  </div>
                </div>
                <div className="border-b border-gray-100 pb-4">
                  <p className="font-medium">Sustainable Living Workshop</p>
                  <p className="text-sm text-gray-500 mt-1">Next Tuesday, 4:00 PM</p>
                  <div className="mt-2">
                    <span className="inline-block bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full">
                      +75 bonus points
                    </span>
                  </div>
                </div>
                <div>
                  <p className="font-medium">Tree Planting Initiative</p>
                  <p className="text-sm text-gray-500 mt-1">Next Month, May 15</p>
                  <div className="mt-2">
                    <span className="inline-block bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full">
                      +200 bonus points
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <button className="w-full py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors">
                  View All Events
                </button>
              </div>
            </motion.div> */}
          </div>
        </div>
      </div>

      <Footer />
    </Page>
  )
}

