import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { loadTossPayments } from "@tosspayments/payment-sdk"; // 🏦 토스 결제 SDK 추가
import "./BookItem.css";

const BookItem = ({ book }) => {
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  // 🏦 토스 결제 함수
  const handlePayment = async () => {
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    const tossPayments = await loadTossPayments(
      "test_ck_pP2YxJ4K87RqyvqEbgjLrRGZwXLO"
    ); // ⚠️ 클라이언트 키 입력

    tossPayments.requestPayment("카드", {
      amount: book.sale_price > 0 ? book.sale_price : book.price, // 🏷️ 할인가가 있으면 적용
      orderId: `order_${new Date().getTime()}`,
      orderName: book.title,
      successUrl: `${window.location.origin}/success`,
      failUrl: `${window.location.origin}/fail`,
      customerEmail: "user@example.com",
      customerName: "홍길동",
    });
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
          <h5 className="book-author">{book.authors}</h5>
          <h5 className="book-publisher">{book.publisher}</h5>
          <h5 className="book-published-date">{book.datetime}</h5>
          <h5 className="book-price">{book.price}원</h5>
          <h5 className="book-sale-price">{book.sale_price}원</h5>
          <h5 className="book-status">{book.status}</h5>
          <div className="button-group">
            <button
              className="rent-button"
              onClick={() => navigate("/rent", { state: { book } })}
            >
              자세히 보기
            </button>
            <button className="pay-button" onClick={handlePayment}>
              결제하기
            </button>
          </div>
        </div>
      </li>
    </div>
  );
};

export default BookItem;
