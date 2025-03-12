import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "../Components/Button";
import Input from "../Components/Input";
import Label from "../Components/Label";
import Page from "./Page";
import AuthContext from "../Context/AuthContext";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import NavBar from "../Components/NavBar/NavBar";

// Define validation schema using Yup
const schema = yup.object().shape({
  username: yup.string().required("Username is required"), // Ensure username is not empty
  email: yup.string().email("Invalid email format").required("Email is required"), // Validate email format
  password: yup
      .string()
      .min(6, "Password must be at least 6 characters long") // Enforce password length constraint
      .required("Password is required"),
});

export default function RegisterPage() {
  // Get the registerUser function from the AuthContext
  const { registerUser, registerError, setRegisterError } = useContext(AuthContext);


  const {
    register,
    handleSubmit,
    formState: { errors },
    // useForm hook for form handling with validation
  } = useForm({
    resolver: yupResolver(schema), // Integrate Yup schema with react-hook-form
    mode: "onChange", // Validate inputs as the user types
  });

  useEffect(() => {
    return () => {
      if (setRegisterError) setRegisterError(null);
    };
  }, [setRegisterError]);

  // Handle form submission
  const onSubmit = (data) => {
    registerUser(data); // Call function to register user with provided data
  };

  return (
      <Page className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
        <NavBar/> {/* Navigation bar at the top */}
        <div className="flex flex-col items-center justify-center px-6 py-16 space-y-12">
          <div className="text-center max-w-2xl space-y-4">
            <h1 className="text-3xl font-bold text-green-700">
              Join the Sustainability Movement!
            </h1>
            <p className="mt-2 text-lg text-gray-700 leading-relaxed">
              Help the University achieve its{" "}
              <span className="font-semibold text-green-700">carbon net zero</span> goal by 2030.
              Be part of the change.
            </p>
          </div>

          {/* Registration Form Container */}
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

          {/* Display login error message if it exists */}
          {registerError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded-lg">
              {registerError}
            </div>
          )}

            {/* Form for user registration */}
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
              <div className="space-y-5">
                {/* Username Input */}
                <div>
                  <Label htmlFor="username" className="sr-only">
                    Username
                  </Label>
                  <Input
                      id="username"
                      name="username"
                      type="text"
                      className="w-full text-black placeholder-gray-500 border border-green-300 bg-green-50 rounded-lg px-4 py-3"
                      placeholder="Username"
                      {...register("username")} // Register input with react-hook-form
                  />
                  {errors.username && (
                      <p className="text-red-600 text-sm mt-1">{errors.username.message}</p>
                  )}
                </div>

                {/* Email Input */}
                <div>
                  <Label htmlFor="email" className="sr-only">
                    Email address
                  </Label>
                  <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className="w-full text-black placeholder-gray-500 border border-green-300 bg-green-50 rounded-lg px-4 py-3"
                      placeholder="Email address"
                      {...register("email")}
                  />
                  {errors.email && (
                      <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                {/* Password Input */}
                <div>
                  <Label htmlFor="password" className="sr-only">
                    Password
                  </Label>
                  <Input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      className="w-full text-black placeholder-gray-500 border border-green-300 bg-green-50 rounded-lg px-4 py-3"
                      placeholder="Password"
                      {...register("password")}
                  />
                  {errors.password && (
                      <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg text-lg">
                  Sign Up
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Page>
  );
}

