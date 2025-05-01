import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import "../styles/BookItem.css";

const BookItem = ({ book }) => {
  const navigate = useNavigate();
  const { accessToken, user, loading } = useAuth();
  console.log("BookItem props:", book);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  // 값 유효성 확인
  const thumbnail =
    book.thumbnail || book.cover_image || "http://localhost:3000/logo192.png";
  const title = book.title || "제목 없음";
  const author = Array.isArray(book.authors)
    ? book.authors.join(", ")
    : book.author || "저자 정보 없음";
  const publisher = book.publisher || "출판사 정보 없음";
  const publishedDate =
    book.datetime?.substring(0, 10) ||
    book.published_date?.substring(0, 10) ||
    "발행일 없음";
  const price =
    typeof book.price === "number" ? `${book.price.toLocaleString()}원` : "";
  const salePrice =
    typeof book.sale_price === "number"
      ? book.sale_price > 0
        ? `${book.sale_price.toLocaleString()}원`
        : "할인 정보 없음"
      : "";
  const status = book.status || "";

  return (
    <div className="book-item-container">
      <li className="book-item">
        <div className="book-item-thumbnail">
          <img src={thumbnail} alt={title} className="book-thumbnail" />
        </div>
        <div className="book-item-details">
          <h3 className="book-title">{title}</h3>
          <h5 className="book-author">{author}</h5>
          <h5 className="book-publisher">{publisher}</h5>
          <h5 className="book-published-date">{publishedDate}</h5>
          <h5 className="book-price">{price}</h5>
          <h5 className="book-sale-price">{salePrice}</h5>
          <h5 className="book-status">{status}</h5>
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
