import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { loadTossPayments } from "@tosspayments/payment-sdk";
import { FaArrowLeft, FaHeart, FaRegHeart } from "react-icons/fa";
import "./BookDetail.css";

const BookDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const book = location.state?.book;

  const [isProcessing, setIsProcessing] = useState(false);
  const [isRented, setIsRented] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    console.log("📌 useEffect 실행 - 책 정보:", book);

    const query = new URLSearchParams(window.location.search);
    const paymentStatus = query.get("payment");

    if (paymentStatus === "success" || paymentStatus === "fail") {
      console.log(`💰 결제 상태: ${paymentStatus}`);
      alert(paymentStatus === "success" ? "결제 성공" : "결제 실패");
    }

    if (book) {
      console.log("🔍 대여 상태 확인 요청...");
      fetch(`/api/book/${book.id}/is-rented`)
        .then((res) => res.json())
        .then((data) => {
          console.log("📖 대여 상태 결과:", data);
          setIsRented(data.isRented);
        })
        .catch((err) => console.error("❌ 대여 상태 확인 오류:", err));

      // 북마크 상태 확인
      const savedBookmarks = JSON.parse(
        localStorage.getItem("bookmarks") || "[]"
      );
      const isBookmarkedState = savedBookmarks.includes(book?.id);
      console.log(`📚 북마크 상태: ${isBookmarkedState}`);
      setIsBookmarked(isBookmarkedState);
    }
  }, [book]);

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  if (!book) {
    return (
      <div className="error-container">
        <h2>📚 책 정보를 불러올 수 없습니다.</h2>
        <button onClick={() => navigate("/")}>홈으로 가기</button>
      </div>
    );
  }

  const handlePayment = async () => {
    if (!user) {
      console.log("🚨 비로그인 상태 - 로그인 페이지로 이동");
      navigate("/login");
      return;
    }

    console.log("💳 결제 진행 중...");
    setIsProcessing(true);

    const orderData = {
      amount: book.sale_price > 0 ? book.sale_price : book.price,
      orderId: `order_${new Date().getTime()}`,
      orderName: book.title,
      successUrl: `${window.location.origin}/book-detail?payment=success`,
      failUrl: `${window.location.origin}/book-detail?payment=fail`,
      customerEmail: user?.email ?? "unknown@example.com",
      customerName: user?.username ?? "미등록 사용자",
    };

    console.log("📝 주문 데이터:", orderData);

    try {
      const tossPayments = await loadTossPayments(
        "test_ck_pP2YxJ4K87RqyvqEbgjLrRGZwXLO"
      );
      await tossPayments.requestPayment("카드", orderData);
    } catch (error) {
      console.error("❌ 결제 오류:", error);
      alert("결제 처리 중 오류가 발생했습니다.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRentBook = () => {
    if (user) {
      console.log("📖 대여 페이지로 이동:", book);
      navigate("/rent", { state: { book } });
    } else {
      console.log("🚨 비로그인 상태 - 로그인 페이지로 이동");
      navigate("/login");
    }
  };

  const handleBookmark = () => {
    if (!book || !book.id) {
      console.error("❌ 북마크 추가 실패: book 또는 book.id가 없음", book);
      return;
    }

    console.log("📚 북마크 버튼 클릭됨 - Book ID:", book.id);

    const savedBookmarks = JSON.parse(
      localStorage.getItem("bookmarks") || "[]"
    );

    const updatedBookmarks = isBookmarked
      ? savedBookmarks.filter((id) => id !== book.id)
      : [...savedBookmarks, book.id];

    localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
    console.log(
      `🔖 북마크 ${isBookmarked ? "삭제" : "추가"}됨:`,
      updatedBookmarks
    );

    setIsBookmarked(!isBookmarked);
  };

  return (
    <div className="book-detail-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        <FaArrowLeft />
      </button>

      <div className="book-header">
        <h1>{book.title}</h1>
        <br />
        <button className="bookmark-button" onClick={handleBookmark}>
          {isBookmarked ? <FaHeart className="bookmarked" /> : <FaRegHeart />}
        </button>
        <br />
      </div>

      <img src={book.thumbnail} alt={book.title} className="book-image" />
      <p>
        <strong>저자:</strong> {book.authors.join(", ")}
      </p>
      <p>
        <strong>출판사:</strong> {book.publisher}
      </p>
      <p>
        <strong>출판 날짜:</strong> {book.datetime.substring(0, 10)}
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

      <a
        href={book.url}
        target="_blank"
        rel="noopener noreferrer"
        className="book-link"
      >
        다음에서 확인하기
      </a>

      <button
        className="rent-button"
        onClick={handleRentBook}
        disabled={isRented}
      >
        {isRented ? "이미 대여됨" : "대여하기"}
      </button>

      <button
        className="payment-button"
        onClick={handlePayment}
        disabled={isProcessing}
      >
        {isProcessing ? "결제 중..." : "결제하기"}
      </button>
    </div>
  );
};

export default BookDetail;
