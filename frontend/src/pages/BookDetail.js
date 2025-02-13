import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./BookDetail.css";

const BookDetail = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const book = location.state?.book;

  if (!book) {
    return <div>책 정보를 불러올 수 없습니다.</div>;
  }

  const handleRentBook = () => {
    if (user) {
      navigate("/rent", { state: { book } });
    } else {
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
  };

  return (
    <div className="book-detail-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        뒤로 가기
      </button>
      <h1>{book.title}</h1>
      <img src={book.thumbnail} alt={book.title} className="book-image" />
      <p>
        <strong>저자:</strong> {book.authors.join(", ")}
      </p>
      {book.translators && book.translators.length > 0 && (
        <p>
          <strong>번역:</strong> {book.translators.join(", ")}
        </p>
      )}
      <p>
        <strong>출판사:</strong> {book.publisher}
      </p>
      <p>
        <strong>출판 날짜:</strong> {book.datetime.substring(0, 10)}
      </p>
      <p>
        <strong>ISBN:</strong> {book.isbn}
      </p>
      <div className="price-info">
        <p>
          <strong>정가:</strong>{" "}
          {book.price ? `${book.price.toLocaleString()}원` : "정보 없음"}
        </p>
        <p>
          <strong>할인가:</strong>{" "}
          {book.sale_price && book.sale_price !== -1
            ? `${book.sale_price.toLocaleString()}원`
            : "할인 정보 없음"}
        </p>
      </div>
      <hr />
      <p>
        <strong>판매 상태:</strong> {book.status}
      </p>
      <hr />
      <p>{book.contents}</p>
      <a
        href={book.url}
        target="_blank"
        rel="noopener noreferrer"
        className="book-link"
      >
        다음 에서 확인 하기
      </a>
      <button className="rent-button" onClick={handleRentBook}>
        대여하기
      </button>
    </div>
  );
};

export default BookDetail;
