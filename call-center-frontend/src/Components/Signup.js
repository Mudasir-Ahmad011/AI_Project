import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name:"",
    username: "",
    email: "",
    password: "",
    role:"",
    phonenumber:""
  });
  useEffect(()=>{
    document.title="SignUp Page"
  },[])
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
      formData.password !== "" && formData.role!=="" && formData.name !== "" && formData.phonenumber!==""
    ) {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:formData.name,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role:formData.role,
          phonenumber:formData.phonenumber

        }),
      });
      if (response.ok) {
        navigate("/");
      }
    } else {
      console.log("Properly fill the required fields");
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm">
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">Sign Up</h2>

        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 mb-2">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your name"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 mb-2">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your username"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
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
          <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
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
        
        <div className="mb-6">
          <label htmlFor="role" className="block text-gray-700 mb-2">Role</label>
          <select id="role" name="role" value={formData.role} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Choose...</option>
            <option value="agent">Agent</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        
        <div className="mb-6">
          <label htmlFor="phonenumber" className="block text-gray-700 mb-2">Phonenumber</label>
          <input
            id="phonenumber"
            name="phonenumber"
            type="text"
            value={formData.phonenumber}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your phonenumber"
          />
        </div>

        <button
          onClick={handleSubmit}
          id="signup"
          className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
        >
          Sign Up
        </button>

        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/" className="text-blue-600 font-semibold hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
