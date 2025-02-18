import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../Components/Button";
import Input from "../Components/Input";
import Label from "../Components/Label";
import NavBar from "../Components/NavBar";
import FeatureCard from "../Components/FeatureCard";
import { FaLeaf, FaRecycle, FaGlobe, FaSolarPanel, FaBicycle } from "react-icons/fa"; // Importing icons

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Registration data:", formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col">
      {/* NavBar */}
      <NavBar />

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center px-6 py-16 space-y-12">
        {/* Sustainability Header */}
        <div className="text-center max-w-2xl space-y-4">
          <h1 className="text-3xl font-bold text-green-700">
            Join the Sustainability Movement!
          </h1>
          <p className="mt-2 text-lg text-gray-700 leading-relaxed">
            Help the University achieve its <span className="font-semibold text-green-700">carbon net zero</span> goal by 2030.  
            Be part of the change.
          </p>
        </div>

        {/* Form Box */}
        <div className="w-full max-w-lg bg-white p-8 shadow-lg rounded-4xl">
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-bold text-green-700">Create an account</h1>
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-green-700 hover:text-green-800">
                Log in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div className="space-y-5">
              <div>
                <Label htmlFor="name" className="sr-only">Username</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="w-full text-black placeholder-gray-500 border border-green-300 bg-green-50 rounded-lg px-4 py-3"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="email" className="sr-only">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full text-black placeholder-gray-500 border border-green-300 bg-green-50 rounded-lg px-4 py-3"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="password" className="sr-only">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="w-full text-black placeholder-gray-500 border border-green-300 bg-green-50 rounded-lg px-4 py-3"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div>
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg text-lg">
                Sign Up
              </Button>
            </div>
          </form>
        </div>

        {/* Feature Cards Section */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-8xl">
          <FeatureCard 
            icon={<FaLeaf className="text-green-600 text-4xl" />} 
            title="Eco-Friendly Initiatives" 
            description="Participate in green projects that help reduce carbon footprint on campus." 
          />
          <FeatureCard 
            icon={<FaRecycle className="text-green-600 text-4xl" />} 
            title="Recycling & Waste Management" 
            description="Learn how to properly dispose of waste and contribute to sustainability." 
          />
          <FeatureCard 
            icon={<FaGlobe className="text-green-600 text-4xl" />} 
            title="Global Impact" 
            description="Join a community that works towards a healthier and cleaner planet." 
          />
          <FeatureCard 
            icon={<FaSolarPanel className="text-green-600 text-4xl" />} 
            title="Electrical minimization" 
            description="Help maintain a low carbon footprint by turning off lights and computers when not in use." 
          />
          <FeatureCard 
            icon={<FaBicycle className="text-green-600 text-4xl" />} 
            title="Sustainable Transport" 
            description="Use bicycles and public transport to reduce emissions and promote a greener campus." 
          />
        </div>
      </div>
    </div>
  );
}

