import React from "react";

const Modal = ({ isOpen, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full sm:w-[90%] md:w-[60%] lg:w-[40%] p-6 rounded-lg shadow-lg">
        {children}
      </div>
    </div>
  );
};

export default Modal;
