// PaymentSuccess.jsx
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const infoParam = query.get("info");

    if (infoParam) {
      const rentalInfo = JSON.parse(decodeURIComponent(infoParam));

      // 서버에 대여 정보 저장
      const saveRental = async () => {
        try {
          const res = await axios.post(
            "http://localhost:5001/toss-pay/success",
            rentalInfo
          );
          if (res.data.success) {
            toast.success("🎉 대여가 완료되었습니다!");
          } else {
            toast.error("⚠️ 대여 정보 저장에 실패했습니다.");
          }
        } catch (error) {
          console.error("대여 저장 오류:", error);
          toast.error("🚨 서버 오류로 대여 저장 실패");
        }
      };

      saveRental();
    } else {
      toast.warn("❗ 유효하지 않은 접근입니다.");
      navigate("/books-list");
    }
  }, [location.search, navigate]);

  return (
    <div className="payment-result-container">
      <h2>🎉 결제가 성공적으로 완료되었습니다!</h2>
      <p>
        이용해주셔서 감사합니다. 대여 내역은 마이페이지에서 확인하실 수
        있습니다.
      </p>
    </div>
  );
};

export default PaymentSuccess;
