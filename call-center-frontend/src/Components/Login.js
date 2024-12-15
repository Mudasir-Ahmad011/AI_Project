import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';


const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  useEffect(()=>{
    document.title="Login Page"
  },[])
  const setUserCookie = (user) => {
    Cookies.set('user', JSON.stringify(user), { expires: 7 });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
  };
  const handleSubmit = async () => {
    if (
      formData.username !== "" &&
      formData.email !== "" &&
      formData.password !== ""
    ) {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setUserCookie(data.user);
        if (data.user.role === "agent") {
          navigate("/agent");
        } 
        if (data.user.role === "admin") {
          navigate("/admin");
        }
      }
    } else {
      console.log("Properly fill the required fields");
    }
  };
  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-800">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm">
          <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">
            Sign In
          </h2>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
            id="login"
          >
            Login
          </button>
        </div>
      </div>
    </>
  );
};

export default Login;
