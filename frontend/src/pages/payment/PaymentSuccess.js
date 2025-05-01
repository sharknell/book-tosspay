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
      try {
        // Ensure the infoParam is decoded and parsed correctly
        const decodedInfo = decodeURIComponent(infoParam);

        // Try parsing the decoded parameter
        const rentalInfo = JSON.parse(decodedInfo);

        // 서버에 대여 정보 저장
        const saveRental = async () => {
          try {
            const res = await axios.post(
              "http://localhost:5001/toss-pay/success",
              rentalInfo,
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            if (res.data.success) {
              console.log("전송할 rentalInfo:", rentalInfo);
              toast.success("🎉 대여가 완료되었습니다!");

              setTimeout(() => {
                // 대여 내역 페이지로 이동
                navigate("/profile");
              }, 5000);
            } else {
              toast.error("⚠️ 대여 정보 저장에 실패했습니다.");
            }
          } catch (error) {
            console.error("대여 저장 오류:", error);
            toast.error("🚨 서버 오류로 대여 저장 실패");
          }
        };

        saveRental();
      } catch (error) {
        console.error("❌ 정보 파싱 오류:", error);
        toast.error("❗ 잘못된 접근입니다. 정보 파싱 오류.");
        navigate("/books-list");
      }
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
