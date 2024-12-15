import React, { useEffect, useState } from "react";
import AgentList from "./AgentList";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
const Admin = () => {
  const [agents, setAgents] = useState([]);
  const navigate = useNavigate();

  useEffect(()=>{
    document.title="Admin Page"
  },[])
  const getAgents = async () => {
    const response = await fetch("http://localhost:5000/api/admin");
    const data = await response.json();
    setAgents(data);
  };
  const getUserCookie = () => {
    const user = Cookies.get('user');
    if (user) {
      return JSON.parse(user);
    }
    return null;
  };
  const removeUserCookie = () => {
    Cookies.remove('user');
  };

  const handleLogOut=()=>{
    removeUserCookie();
    navigate("/");
  }
  const user = getUserCookie();
  return (
    <div className="bg-slate-500 min-h-screen">
      <nav className="bg-slate-600 text-white p-2 flex justify-between items-center">
        <div className="text-xl font-semibold">
          <a href="/admin">Call Center</a>
        </div>
        {user && (
          <div className="text-lg">
            Welcome, {user.name}
          </div>
        )}
        <button onClick={handleLogOut} className="bg-red-500 px-4 py-2 rounded-lg">
          Logout
        </button>
      </nav>
      <div className="flex justify-center items-center">
        <div className="w-full max-w-4xl p-5 space-y-5">
          <AgentList agents={agents} getAgents={getAgents} />
        </div>
      </div>
    </div>
  );
};

export default Admin;
