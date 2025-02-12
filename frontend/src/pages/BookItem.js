import React from "react";
import { useNavigate } from "react-router-dom";

const BookItem = ({ book, user }) => {
  const navigate = useNavigate();

  const handleRentBook = () => {
    if (user) {
      navigate("/rent", { state: { book } });
    } else {
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
  };

  const handleViewDetails = () => {
    navigate("/book-detail", { state: { book } });
  };

  return (
    <li className="book-item">
      <div className="book-item-thumbnail">
        <img src={book.thumbnail} alt={book.title} className="book-thumbnail" />
      </div>
      <div className="book-item-details">
        <h3 className="book-title">{book.title}</h3>
        <hr />
        <p className="book-description">{book.contents}</p>
        <button className="detail-button" onClick={handleViewDetails}>
          자세히 보기
        </button>
        <button className="rent-button" onClick={handleRentBook}>
          대여하기
        </button>
      </div>
    </li>
  );
};

export default BookItem;
