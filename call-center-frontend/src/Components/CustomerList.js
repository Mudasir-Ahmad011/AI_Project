import React, { useEffect, useState } from "react";
import UpdateCustomer from "./UpdateCustomer";
import Modal from "./Modal";
function CustomerList({ customers, getCustomers }) {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleEditClick = (customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };
  const handleChange = () => {
    getCustomers();
    handleCloseModal();
  };
  const handleDeleteClick = async (id) => {
    alert("Confirm to Delete");
    const response = await fetch(`http://localhost:5000/api/agent/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    console.log("Deleted Successfully");
    getCustomers();
    setSelectedCustomer(null);
  };
  useEffect(() => {
    getCustomers();
  }, []);
  return (
    <>
      <div className="w-full">
    <h2 className="text-2xl font-semibold text-gray-700">Customer Details</h2>
  <div className="overflow-x-auto">
    <table className="min-w-full bg-slate-400  shadow-lg">
      <thead>
        <tr>
          <th className="py-2 px-4 bg-gray-200 text-left text-sm font-semibold text-gray-700">
            Name
          </th>
          <th className="py-2 px-4 bg-gray-200 text-left text-sm font-semibold text-gray-700">
            Age
          </th>
          <th className="py-2 px-4 bg-gray-200 text-left text-sm font-semibold text-gray-700">
            Email
          </th>
          <th className="py-2 px-4 bg-gray-200 text-left text-sm font-semibold text-gray-700">
            Phone
          </th>
          <th className="py-2 px-4 bg-gray-200 text-left text-sm font-semibold text-gray-700">
            Address
          </th>
          <th className="py-2 px-4 bg-gray-200 text-left text-sm font-semibold text-gray-700">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {customers.map((customer) => (
          <tr key={customer._id} className="border-t">
            <td className="py-2 px-4 text-sm text-gray-800">{customer.name}</td>
            <td className="py-2 px-4 text-sm text-gray-800">{customer.age}</td>
            <td className="py-2 px-4 text-sm text-gray-600">{customer.email}</td>
            <td className="py-2 px-4 text-sm text-gray-600">{customer.phone}</td>
            <td className="py-2 px-4 text-sm text-gray-800">{customer.address}</td>
            <td className="py-2 px-4 text-sm">
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditClick(customer)}
                  className="bg-blue-500 text-white rounded-lg px-3 py-1"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(customer._id)}
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
        {selectedCustomer && (
          <UpdateCustomer
            customer={selectedCustomer}
            onUpdate={handleChange}
            closeModal={handleCloseModal}
          />
        )}
      </Modal>
    </>
  );
}
export default CustomerList;
