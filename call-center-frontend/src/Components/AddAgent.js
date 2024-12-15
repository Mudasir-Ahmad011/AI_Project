import React, { useState } from "react";

const AddAgent = ({closeModal,onAdd }) => {
    const defaultValue = {
    name:"",
    username:"",
    email:"",
    password:"",
    role:"agent",
    phonenumber:""
  };
  const [agentData, setagentData] = useState(defaultValue);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setagentData((prev) => {
      return { ...prev, [name]: value };
    });
  };
  const handleSubmit = async () => {
    if (
      agentData.name!==""&&
      agentData.username!==""&&
      agentData.email!==""&&
      agentData.password!==""&&
      agentData.role!==""&&
      agentData.phonenumber!==""
    ) {
      const response = await fetch("http://localhost:5000/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name:agentData.name,
            username:agentData.username,
            email:agentData.email,
            password:agentData.password,
            role:agentData.role,
            phonenumber:agentData.phonenumber
        }),
      });
      console.log("Added Successfully");
      setagentData(defaultValue);
      onAdd();
    }
  };
  return (
    <>
       <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Create Agent Profile
          </h3>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1">
                <label className="block text-gray-600">Name</label>
                <input
                  type="text"
                  name="name"
                  value={agentData.name}
                  onChange={handleChange}
                  className="w-full p-2 border-2 border-gray-300 rounded-md"
                />
              </div>
              <div className="flex-1">
                <label className="block text-gray-600">Username</label>
                <input
                  type="text"
                  name="username"
                  value={agentData.username}
                  onChange={handleChange}
                  className="w-full p-2 border-2 border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1">
                <label className="block text-gray-600">Email</label>
                <input
                  type="email"
                  name="email"
                  value={agentData.email}
                  onChange={handleChange}
                  className="w-full p-2 border-2 border-gray-300 rounded-md"
                />
              </div>
              
              <div className="flex-1">
                <label className="block text-gray-600">Password</label>
                <input
                  type="password"
                  name="password"
                  value={agentData.password}
                  onChange={handleChange}
                  className="w-full p-2 border-2 border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1">
                <label className="block text-gray-600">Role</label>
                <input
                  type="text"
                  name="role"
                  placeholder="Agent"
                  onChange={handleChange}
                  disabled={true}
                  className="w-full p-2 border-2 border-gray-300 rounded-md"
                />
              </div>
              <div className="flex-1">
                <label className="block text-gray-600">Phonenumber</label>
                <input
                  type="text"
                  name="phonenumber"
                  value={agentData.phonenumber}
                  onChange={handleChange}
                  className="w-full p-2 border-2 border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={closeModal}
              className="bg-gray-300 text-gray-800 rounded-lg px-6 py-2"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              id="addUser"
              className="bg-blue-500 text-white rounded-lg px-6 py-2"
            >
              Add
            </button>
          </div>
    </>
  );
};

export default AddAgent;