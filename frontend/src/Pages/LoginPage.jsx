import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../Components/Button";
import Input from "../Components/Input";
import Label from "../Components/Label";
import Page from "./Page";
import AuthContext from "../Context/AuthContext";

export default function LoginPage() {
    let { loginUser } = useContext(AuthContext);

    const [loginData, setLoginData] = useState({
        username: "", 
        password: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLoginData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        loginUser(loginData); 
    };

    return (
        <Page className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col">

            {/* Main Content */}
            <div className="flex flex-col items-center justify-center px-6 py-16 space-y-12">
                {/* Header */}
                <div className="text-center max-w-2xl space-y-4">
                    <h1 className="text-3xl font-bold text-green-700">Log in</h1>
                    <p className="mt-2 text-lg text-gray-700 leading-relaxed">
                        Help the University achieve its <span className="font-semibold text-green-700">carbon net zero</span> goal by 2030.  
                        Be part of the change.
                    </p>
                </div>

                {/* Form Box */}
                <div className="w-full max-w-lg bg-white p-8 shadow-lg rounded-4xl">
                    <div className="text-center space-y-3">
                        <h1 className="text-3xl font-bold text-green-700">Log in to your account</h1>
                        <p className="text-sm text-gray-600">
                            Don't have an account?{" "}
                            <Link to="/register" className="font-medium text-green-700 hover:text-green-800">
                                Sign up
                            </Link>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                        <div className="space-y-5">
                            <div>
                                <Label htmlFor="username" className="sr-only">Username</Label>
                                <Input
                                    id="username"
                                    name="username" // ✅ Changed from "email" to "username"
                                    type="text"
                                    autoComplete="username"
                                    required
                                    className="w-full text-black placeholder-gray-500 border border-green-300 bg-green-50 rounded-lg px-4 py-3"
                                    placeholder="Username"
                                    value={loginData.username}
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
                                    value={loginData.password}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center">
                            <input
                                id="rememberMe"
                                name="rememberMe"
                                type="checkbox"
                                className="text-green-600 focus:ring-green-500"
                            />
                            <label htmlFor="rememberMe" className="ml-2 text-sm text-green-600">Remember me</label>
                        </div>

                        <div>
                            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg text-lg">
                                Log In
                            </Button>
                        </div>
                    </form>

                    {/* Forgot Password */}
                    <div className="mt-4 text-center">
                        <Link to="/forgot-password" className="text-sm text-green-700 hover:text-green-800">
                            Forgot Password?
                        </Link>
                    </div>
                </div>
            </div>
        </Page>
    );
}
