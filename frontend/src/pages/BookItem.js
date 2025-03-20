import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { loadTossPayments } from "@tosspayments/payment-sdk";
import "./BookItem.css";

const BookItem = ({ book }) => {
  const navigate = useNavigate();
  const { accessToken, user, loading } = useAuth(); // 로딩 상태 추가
  console.log("📌 BookItem에서 받은 user 정보:", user);

  // 로딩 중일 때 처리
  if (loading) {
    return <div>로딩 중...</div>;
  }

  // user가 없으면 로그인 페이지로 이동
  if (!user) {
    navigate("/login");
    return null; // 로그인 후 렌더링
  }

  // 결제 처리 함수
  const handlePayment = async () => {
    if (!accessToken || !user) {
      navigate("/login");
      return;
    }

    const orderData = {
      amount: book.sale_price > 0 ? book.sale_price : book.price,
      orderId: `order_${new Date().getTime()}`,
      orderName: book.title,
      successUrl: `${window.location.origin}/success`,
      failUrl: `${window.location.origin}/fail`,
      customerEmail: user?.email ?? "unknown@example.com",
      customerName: user?.name ?? "미등록 사용자",
    };

    console.log("📦 결제 요청 정보:", orderData);

    const tossPayments = await loadTossPayments(
      "test_ck_pP2YxJ4K87RqyvqEbgjLrRGZwXLO"
    );

    tossPayments.requestPayment("카드", orderData);
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
              onClick={() => navigate("/book-detail", { state: { book } })}
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
