import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import "../styles/BookItem.css"; // CSS 파일 import

const BookItem = ({ book }) => {
  const navigate = useNavigate();
  const { accessToken, user, loading } = useAuth();

  // 로딩 중일 때 처리
  if (loading) {
    return <div>로딩 중...</div>;
  }

  // 로그인되지 않았으면 로그인 페이지로 이동
  if (!user) {
    navigate("/login");
    return null;
  }

  // 결제 처리 함수
  return (
    <div className="book-item-container">
      <li className="book-item">
        <div className="book-item-thumbnail">
          <img
            src={book.thumbnail || "http://localhost:3000/logo192.png"} // 기본 이미지 추가
            alt={book.title}
            className="book-thumbnail"
          />
        </div>
        <div className="book-item-details">
          <h3 className="book-title">{book.title}</h3>
          <h5 className="book-author">{book.authors.join(", ")}</h5>{" "}
          {/* 저자 배열 처리 */}
          <h5 className="book-publisher">{book.publisher}</h5>
          <h5 className="book-published-date">
            {book.datetime?.substring(0, 10)}
          </h5>{" "}
          {/* 날짜 형식 수정 */}
          <h5 className="book-price">{book.price.toLocaleString()}원</h5>
          <h5 className="book-sale-price">
            {book.sale_price > 0
              ? book.sale_price.toLocaleString() + "원"
              : "할인 정보 없음"}
          </h5>
          <h5 className="book-status">{book.status}</h5>
          <div className="button-group">
            <button
              className="rent-button"
              onClick={() => navigate("/books-list", { state: { book } })}
            >
              자세히 보기
            </button>
          </div>
        </div>
      </li>
    </div>
  );
};

export default BookItem;
