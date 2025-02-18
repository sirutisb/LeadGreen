import { Leaf, TableOfContents } from "lucide-react"
import UserNav from "./UserNav"
import { Link } from "react-router-dom"
//na

export default function NavBar(){
    return(
      <header className="container py-8 bg-[#f3f1ea] ">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-green-600" />
            <Link to={"/"} className="text-2xl font-bold text-green-700">LeadGreen</Link>
          </div>

          <UserNav>

          </UserNav>
        </nav>
      </header>
    )
}