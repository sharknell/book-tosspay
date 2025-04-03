import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaBookmark, FaRegBookmark } from "react-icons/fa";
import { loadTossPayments } from "@tosspayments/payment-sdk";
import { useAuth } from "../context/authContext";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";
import "./BookDetail.css";

const clientKey = "test_ck_pP2YxJ4K87RqyvqEbgjLrRGZwXLO";

const BookDetail = () => {
  const { isbn } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [tossPayments, setTossPayments] = useState(null);
  const [selectedRange, setSelectedRange] = useState({ from: null, to: null });
  const [price, setPrice] = useState(10000);
  const { user } = useAuth();
  const userId = user?.id;
  const [isBookmarked, setIsBookmarked] = useState(false);

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
        setBook(data);
        setPrice(data.price || 10000);
      } catch (error) {
        console.error("❌ 도서 정보 가져오기 오류:", error);
      }
    };
    fetchBookDetail();
  }, [isbn]);

  useEffect(() => {
    loadTossPayments(clientKey).then((payments) => setTossPayments(payments));
  }, []);

  useEffect(() => {
    const { from, to } = selectedRange;
    if (from && to) {
      const rentalDays = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;
      setPrice(500 * rentalDays);
    }
  }, [selectedRange]);

  useEffect(() => {
    if (!userId || !isbn) return;
    const checkBookmark = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/api/bookmarks/${userId}/${isbn}`
        );
        const data = await response.json();
        setIsBookmarked(data.isBookmarked);
      } catch (error) {
        console.error("❌ 북마크 상태 확인 오류:", error);
      }
    };
    checkBookmark();
  }, [userId, isbn]);

  const handleRentalPayment = async () => {
    if (!tossPayments || !book) return;
    try {
      await tossPayments.requestPayment("카드", {
        amount: price,
        orderId: `rental-${isbn}-${Date.now()}`,
        orderName: `${book.title} 대여`,
        successUrl: window.location.origin + "/payment-success",
        failUrl: window.location.origin + "/payment-fail",
      });
    } catch (error) {
      console.error("❌ 결제 오류:", error);
    }
  };

  const handleBookmarkToggle = async () => {
    if (!userId || !isbn) return;
    try {
      const response = await fetch(`http://localhost:5001/api/bookmarks`, {
        method: isBookmarked ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isbn }),
      });
      if (!response.ok) throw new Error("북마크 처리 오류");
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error("❌ 북마크 처리 오류:", error);
    }
  };

  if (!book) {
    return <div className="loading">📚 책 정보를 불러오는 중...</div>;
  }

  return (
    <div className="book-detail-container">
      <button className="back-button" onClick={() => navigate("/books-list")}>
        <FaArrowLeft /> 뒤로가기
      </button>
      <div className="book-info">
        <h1>{book.title || "제목 없음"}</h1>
        <img
          src={book.cover_image || "/default-thumbnail.jpg"}
          alt={book.title || "책 이미지"}
          className="book-image"
        />
        <button className="bookmark-button" onClick={handleBookmarkToggle}>
          {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
          {isBookmarked ? " 북마크 해제" : " 북마크 추가"}
        </button>
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

        <div className="date-picker">
          <p>
            <strong>대여 기간 선택:</strong>
          </p>
          <DayPicker
            mode="range"
            selected={selectedRange}
            onSelect={setSelectedRange}
            disabled={{ before: new Date() }}
          />
          {selectedRange.from && selectedRange.to && (
            <p>
              📅 {format(selectedRange.from, "yyyy-MM-dd")} ~{" "}
              {format(selectedRange.to, "yyyy-MM-dd")}
            </p>
          )}
        </div>

        <p className="price-section">
          <strong>대여 가격:</strong> {price.toLocaleString()}원
        </p>

        <button className="pay-button" onClick={handleRentalPayment}>
          렌탈하기
        </button>
      </div>
    </div>
  );
};

export default BookDetail;
