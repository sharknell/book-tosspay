// components/AddressModal.jsx
import React from "react";
import DaumPostcode from "react-daum-postcode";

const AddressModal = ({ onClose, onComplete }) => {
  const handleComplete = (data) => {
    const fullAddress = data.address;
    onComplete(fullAddress);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded shadow-md w-[400px]">
        <DaumPostcode onComplete={handleComplete} />
        <button onClick={onClose} className="mt-2 text-blue-500">
          닫기
        </button>
      </div>
    </div>
  );
};

export default AddressModal;
