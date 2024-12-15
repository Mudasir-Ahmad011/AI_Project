import React, { useEffect, useState } from "react";

const UpdateCustomer = ({ customer, onUpdate, closeModal }) => {
  const [customerData, setcustomerData] = useState({
    name: customer.name,
    age: customer.age,
    email:customer.email,
    phone:customer.phone,
    address:customer.address
  });
  useEffect(() => {
    setcustomerData({
        name: customer.name,
        age: customer.age,
        email:customer.email,
        phone:customer.phone,
        address:customer.address
    });
  }, [customer]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setcustomerData((prev) => {
      return { ...prev, [name]: value };
    });
  };
  const handleSubmit = async () => {
    if (
      customerData.name !== "" &&
      customerData.age !== ""&&
      customerData.email !== "" &&
      customerData.phone !== ""&&
      customerData.address!==""
    ) {
      const response = await fetch(
        `http://localhost:5000/api/agent/${customer._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: customerData.name,
            age: parseInt(customerData.age,10),
            email:customerData.email,
            phone:customerData.phone,
            address:customerData.address
          }),
        }
      );
      console.log("Updated Successfully");
      onUpdate();
    } else {
      console.log("Properly fill the required fields");
    }
  };
  return (
    <>
     
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Update Customer Details
          </h3>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1">
                <label className="block text-gray-600">Name</label>
                <input
                  type="text"
                  name="name"
                  value={customerData.name}
                  onChange={handleChange}
                  className="w-full p-2 border-2 border-gray-300 rounded-md"
                />
              </div>
              <div className="flex-1">
                <label className="block text-gray-600">Age</label>
                <input
                  type="text"
                  name="age"
                  value={customerData.age}
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
                  value={customerData.email}
                  onChange={handleChange}
                  className="w-full p-2 border-2 border-gray-300 rounded-md"
                />
              </div>
              <div className="flex-1">
                <label className="block text-gray-600">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={customerData.phone}
                  onChange={handleChange}
                  className="w-full p-2 border-2 border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1">
                <label className="block text-gray-600">Address</label>
                <input
                  type="text"
                  name="address"
                  value={customerData.address}
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
              id="updateProduct"
              className="bg-blue-500 text-white rounded-lg px-6 py-2"
            >
              Update
            </button>
          </div>

    </>
  );
};

export default UpdateCustomer;
