import { Leaf, TableOfContents } from "lucide-react"
import UserNav from "./UserNav"
import { Link } from "react-router-dom"
//na

export default function NavBar(){
    return(
      <div className="flex justify-between items-center py-8 bg-[#f3f1ea] ">
        <div className="flex items-center space-x-2 px-8">
          <Leaf className="h-8 w-8 text-green-600" />
          <Link to={"/"} className="text-2xl font-bold text-green-700">LeadGreen</Link>
        </div>

        <div className="">
          <div className="flex items-center space-x-6 px-8">
            <Link to={"/feed"} className="text-2xl font-bold text-green-700">Feeds</Link>
            <Link to={"/leaderboard"} className="text-2xl font-bold text-green-700">Leaderboard</Link>
            <Link to={"/game"} className="text-2xl font-bold text-green-700">Game</Link>
            <UserNav/>
          </div>
        </div>
      </div>
    )
}