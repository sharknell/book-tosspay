import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import "../styles/BookItem.css";

const BookItem = ({ book }) => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  if (loading) return <div>로딩 중...</div>;

  const thumbnail = book.thumbnail || book.cover_image || "/logo192.png";
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
    typeof book.sale_price === "number" && book.sale_price > 0
      ? `${book.sale_price.toLocaleString()}원`
      : "";

  const handleDetail = () => {
    navigate(`/books-list/${book.id}`);
  };

  return (
    <div className="book-card" onClick={handleDetail}>
      <img src={thumbnail} alt={title} className="book-image" />
      <div className="book-info">
        <h3 className="book-title">{title}</h3>
        <p className="book-author">{author}</p>
        <p className="book-publisher">{publisher}</p>
        <p className="book-date">{publishedDate}</p>
        {price && <p className="book-price">정가: {price}</p>}
        {salePrice && <p className="book-sale-price">할인가: {salePrice}</p>}
      </div>
    </div>
  );
};

export default BookItem;
