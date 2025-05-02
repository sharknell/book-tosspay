import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext"; // useAuth 훅 임포트
import "../styles/Welcome.css";

const Welcome = () => {
  const { user } = useAuth(); // 로그인 상태와 사용자 정보 가져오기
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (user) {
      // 로그인한 사용자는 서비스 이용 페이지로 이동
      navigate("/books-list"); // 서비스 이용 페이지로 이동
    } else {
      // 로그인하지 않은 사용자는 로그인 페이지로 이동
      navigate("/account"); // 로그인 페이지로 이동
    }
  };

  return (
    <div className="welcome-container">
      <h1>🚀 도서 대여 서비스에 오신 것을 환영합니다!</h1>
      <p>
        다양한 책을 언제든지 대여하고, 원하는 기간 동안 독서의 즐거움을
        만끽하세요.
      </p>
      <p>
        책 대여부터 반납까지, 간편한 시스템을 통해 손쉽게 이용할 수 있습니다.
        또한, 북마크 기능을 통해 좋아하는 책을 저장하고, 다른 이용자들과 책을
        추천하며 소통할 수 있습니다.
      </p>
      <p>원하는 책을 대여하고, 새로운 지식의 세계로 여행을 떠나세요!</p>
      <button className="welcome-button" onClick={handleButtonClick}>
        {user ? "서비스 이용하러 가기" : "로그인 / 회원가입 하기"}
      </button>
    </div>
  );
};

export default Welcome;
