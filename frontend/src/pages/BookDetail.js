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

  const handlePayment = () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    // 1. 백엔드로 결제 요청을 보내 결제 정보를 받아온다.
    fetch("/api/create-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: book.sale_price, // 결제 금액
        productName: book.title, // 결제 상품명
        userId: user.id, // 사용자 정보
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const { paymentUrl, paymentToken } = data; // 백엔드에서 받은 결제 URL과 토큰

        // 2. Toss Payments SDK를 사용하여 결제 창을 연다.
        if (window.TossPayments) {
          const tossPayments = window.TossPayments("your_toss_payment_key"); // 실제 토스 키를 사용하세요.

          tossPayments.requestPayment("카드", {
            orderId: paymentToken,
            amount: book.sale_price, // 결제 금액
            orderName: book.title,
            successUrl: "https://your-site.com/success", // 결제 성공 후 리디렉션 URL
            failUrl: "https://your-site.com/fail", // 결제 실패 후 리디렉션 URL
          });
        }
      })
      .catch((error) => {
        console.error("결제 처리 오류:", error);
        alert("결제 처리 중 오류가 발생했습니다.");
      });
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
      <p></p>
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

      {/* 결제 버튼 */}
      <button className="payment-button" onClick={handlePayment}>
        결제하기
      </button>
    </div>
  );
};

export default BookDetail;
