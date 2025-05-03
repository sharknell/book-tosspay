import React, { useState } from "react";
import { registerUser } from "../services/accountService";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import DaumPostcode from "react-daum-postcode";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Register.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [isPostcodeModalOpen, setIsPostcodeModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleComplete = (data) => {
    setAddress(data.address);
    setIsPostcodeModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullAddress = `${address} ${detailAddress}`;

    try {
      await registerUser(email, username, password, phoneNumber, fullAddress);
      toast.success("회원가입 성공! 5초 후 서비스 이용 페이지로 이동합니다.");
      setTimeout(() => {
        navigate("/");
      }, 5000);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">회원가입</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <label>
          이메일 <span className="required">*</span>
        </label>
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>
          사용자명 <span className="required">*</span>
        </label>
        <input
          type="text"
          placeholder="사용자명"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label>
          비밀번호 <span className="required">*</span>
        </label>
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label>
          전화번호 <span className="required">*</span>
        </label>
        <input
          type="tel"
          placeholder="전화번호 (예: 010-1234-5678)"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />

        <div className="address-section">
          <label>
            주소 <span className="required">*</span>
          </label>
          <button
            type="button"
            className="search-address-btn"
            onClick={() => setIsPostcodeModalOpen(true)}
          >
            주소 검색
          </button>
          <input
            type="text"
            placeholder="주소"
            value={address}
            readOnly
            required
          />

          <label>
            상세 주소 <span className="required">*</span>
          </label>
          <input
            type="text"
            placeholder="상세 주소"
            value={detailAddress}
            onChange={(e) => setDetailAddress(e.target.value)}
            required
          />
        </div>

        {isPostcodeModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button
                className="modal-close-btn"
                onClick={() => setIsPostcodeModalOpen(false)}
              >
                ×
              </button>
              <DaumPostcode onComplete={handleComplete} />
            </div>
          </div>
        )}

        <button type="submit">회원가입</button>
      </form>
      <ToastContainer position="top-center" autoClose={2000} theme="colored" />
    </div>
  );
};

export default Register;
