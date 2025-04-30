// src/pages/PaymentFail.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa";

const PaymentFail = () => {
  const navigate = useNavigate();

  return (
    <div className="payment-result-container">
      <FaTimesCircle size={80} color="red" />
      <h2>결제에 실패했습니다 ❌</h2>
      <p>결제가 취소되었거나 오류가 발생했어요. 다시 시도해 주세요.</p>
      <button onClick={() => navigate("/books-list")} className="back-button">
        📚 도서 목록으로 이동
      </button>
    </div>
  );
};

export default PaymentFail;
