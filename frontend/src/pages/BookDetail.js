import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./BookDetail.css";

const BookDetail = () => {
  const { isbn } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);

  useEffect(() => {
    if (!isbn) return;

    const fetchBookDetail = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/api/books/books/${isbn}`
        );
        if (!response.ok)
          throw new Error(`HTTP 오류! 상태 코드: ${response.status}`);

        const data = await response.json();
        console.log("📚 API 응답 데이터:", data);
        setBook(data);
      } catch (error) {
        console.error("❌ 도서 정보 가져오기 오류:", error);
      }
    };

    fetchBookDetail();
  }, [isbn]);

  if (!book) {
    return <div className="loading">📚 책 정보를 불러오는 중...</div>;
  }

  return (
    <div className="book-detail-container">
      <button className="back-button" onClick={() => navigate("/books-list")}>
        <FaArrowLeft />
      </button>
      <div className="book-info">
        <h1>{book.title || "제목 없음"}</h1>
        <img
          src={book.cover_image || "/default-thumbnail.jpg"}
          alt={book.title || "책 이미지"}
          className="book-image"
        />
        <div className="book-description">
          <p>
            <strong>저자:</strong> {book.author || "정보 없음"}
          </p>
          <p>
            <strong>출판사:</strong> {book.publisher || "정보 없음"}
          </p>
          <p>
            <strong>출판 날짜:</strong> {book.published_date || "정보 없음"}
          </p>
          <p>
            <strong>재고:</strong>{" "}
            {book.stock > 0 ? `${book.stock}권 남음` : "품절"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
