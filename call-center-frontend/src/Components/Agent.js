import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import CustomerList from "./CustomerList";
const Agent = () => {
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();

  useEffect(()=>{
    document.title="Agent Page"
  },[])

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
  const handleAddClick=()=>{
    navigate("/AddCustomer")
  }
  const user = getUserCookie();
  const getCustomers = async () => {
    const response = await fetch(`http://localhost:5000/api/agent?agentUsername=${user.username}`,{
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    setCustomers(data);
  };
  return (
    <div className="bg-slate-500 min-h-screen">
      <nav className="bg-slate-600 text-white p-2 flex justify-between items-center">
        <div className="text-xl font-semibold">
          <a href="/agent">Call Center</a>
        </div>
        {user && (
          <div className="text-lg">
            Welcome Agent, {user.name}
          </div>
        )}
        <div className="space-x-4">
            <button
              onClick={handleAddClick}
              className="bg-green-500 px-4 py-2 rounded-lg"
            >
              Add Customer
            </button>
            <button
              onClick={handleLogOut}
              className="bg-red-500 px-4 py-2 rounded-lg"
            >
              Logout
            </button>
      </div>
      </nav>
      <div className="flex justify-center items-center">
        <div className="w-full max-w-4xl p-5 space-y-5">
          <CustomerList customers={customers} getCustomers={getCustomers}/>
        </div>
      </div>
    </div>
  );
};

export default Agent;
