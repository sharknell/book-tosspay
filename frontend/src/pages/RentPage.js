import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/RentPage.css"; // CSS 파일 import

const RENTAL_PRICES = {
  7: 2000,
  14: 3500,
  30: 6000,
};

const RentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const book = location.state?.book;
  const [rentalPeriod, setRentalPeriod] = useState(7);

  if (!book) {
    return <div>도서 정보를 불러올 수 없습니다.</div>;
  }

  const rentalPrice = RENTAL_PRICES[rentalPeriod] ?? 0;

  const handlePayment = () => {
    alert(
      `"${
        book.title
      }" 도서를 ${rentalPeriod}일 동안 대여합니다.\n결제 금액: ${rentalPrice.toLocaleString()}원\n결제 수단: 토스페이`
    );

    const rentalData = {
      bookTitle: book.title,
      rentalPeriod,
      rentalPrice,
      paymentMethod: "토스페이",
      rentalDate: new Date().toISOString().substring(0, 10),
      returnDate: new Date(Date.now() + rentalPeriod * 24 * 60 * 60 * 1000)
        .toISOString()
        .substring(0, 10),
    };

    localStorage.setItem("rentalHistory", JSON.stringify(rentalData));

    navigate("/books"); // 대여 후 도서 목록으로 이동
  };

  return (
    <div className="rent-page-container">
      <h1>📚 도서 대여</h1>
      <img src={book.thumbnail} alt={book.title} className="rent-thumbnail" />
      <p>
        <strong>제목:</strong> {book.title}
      </p>
      <p>
        <strong>저자:</strong> {book.authors.join(", ")}
      </p>
      <p>
        <strong>출판사:</strong> {book.publisher}
      </p>
      <p>
        <strong>출판 날짜:</strong> {book.datetime.substring(0, 10)}
      </p>

      <hr />

      <label>📅 대여 기간 선택:</label>
      <select
        value={rentalPeriod}
        onChange={(e) => setRentalPeriod(Number(e.target.value))}
      >
        <option value={7}>7일 - 2,000원</option>
        <option value={14}>14일 - 3,500원</option>
        <option value={30}>30일 - 6,000원</option>
      </select>

      <p className="total-price">
        💰 총 결제 금액: {rentalPrice.toLocaleString()}원
      </p>

      <button className="toss-pay-button" onClick={handlePayment}>
        💳 토스페이로 결제하기
      </button>
    </div>
  );
};

export default RentPage;
