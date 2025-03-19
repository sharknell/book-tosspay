import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext"; // 🔥 AuthContext 활용

const BookItem = ({ book }) => {
  const navigate = useNavigate();
  const { accessToken } = useAuth(); // 🔥 현재 로그인 상태 가져오기

  const handleRentBook = () => {
    if (accessToken) {
      navigate("/rent", { state: { book } });
    } else {
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
  };

  return (
    <div className="book-item-container">
      <li className="book-item">
        <div className="book-item-thumbnail">
          <img
            src={book.thumbnail}
            alt={book.title}
            className="book-thumbnail"
          />
        </div>
        <div className="book-item-details">
          <h3 className="book-title">{book.title}</h3>
          <button className="rent-button" onClick={handleRentBook}>
            대여하기
          </button>
        </div>
      </li>
    </div>
  );
};

export default BookItem;
