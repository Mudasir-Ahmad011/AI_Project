import React, { useEffect, useState } from "react";
import UpdateAgent from "./UpdateAgent";
import Modal from "./Modal";
import AddAgent from "./AddAgent";
function AgentList({ agents, getAgents }) {
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleAddClick = ()=>{
    setIsModalOpen(true);
  }
  const handleEditClick = (agent) => {
    setSelectedAgent(agent);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAgent(null);
  };
  const handleChange = () => {
    getAgents();
    handleCloseModal();
  };
  const handleDeleteClick = async (id) => {
    alert("Confirm to Delete");
    const response = await fetch(`http://localhost:5000/api/admin/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    console.log("Deleted Successfully");
    getAgents();
    setSelectedAgent(null);
  };
  useEffect(() => {
    getAgents();
  }, []);
  return (
    <>
      <div className="w-full">
  <div className="flex justify-between mb-4">
    <h2 className="text-2xl font-semibold text-gray-700">Agent List</h2>
    <button
      onClick={handleAddClick}
      className="bg-blue-500 text-white rounded-lg px-4 py-2"
    >
      Create New Profile
    </button>
  </div>

  <div className="overflow-x-auto">
    <table className="min-w-full bg-slate-400  shadow-lg">
      <thead>
        <tr>
          <th className="py-2 px-4 bg-gray-200 text-left text-sm font-semibold text-gray-700">
            Name
          </th>
          <th className="py-2 px-4 bg-gray-200 text-left text-sm font-semibold text-gray-700">
            Email
          </th>
          <th className="py-2 px-4 bg-gray-200 text-left text-sm font-semibold text-gray-700">
            Phone
          </th>
          <th className="py-2 px-4 bg-gray-200 text-left text-sm font-semibold text-gray-700">
            Password
          </th>
          <th className="py-2 px-4 bg-gray-200 text-left text-sm font-semibold text-gray-700">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {agents.map((agent) => (
          <tr key={agent._id} className="border-t">
            <td className="py-2 px-4 text-sm text-gray-800">{agent.name}</td>
            <td className="py-2 px-4 text-sm text-gray-600">{agent.email}</td>
            <td className="py-2 px-4 text-sm text-gray-600">{agent.phonenumber}</td>
            <td className="py-2 px-4 text-sm text-gray-800">{agent.password}</td>
            <td className="py-2 px-4 text-sm">
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditClick(agent)}
                  className="bg-blue-500 text-white rounded-lg px-3 py-1"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(agent._id)}
                  className="bg-red-500 text-white rounded-lg px-3 py-1"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>


      <Modal isOpen={isModalOpen}>
        {selectedAgent ? (
          <UpdateAgent
            agent={selectedAgent}
            onUpdate={handleChange}
            closeModal={handleCloseModal}
          />
        ):<AddAgent closeModal={handleCloseModal} onAdd={handleChange}/>}
      </Modal>
    </>
  );
}
export default AgentList;
