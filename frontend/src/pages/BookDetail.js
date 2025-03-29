import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaBookmark, FaRegBookmark } from "react-icons/fa";
import { loadTossPayments } from "@tosspayments/payment-sdk";
import { useAuth } from "../context/authContext";
import "./BookDetail.css";

const clientKey = "test_ck_pP2YxJ4K87RqyvqEbgjLrRGZwXLO";

const BookDetail = () => {
  const { isbn } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [tossPayments, setTossPayments] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [price, setPrice] = useState(10000);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { user } = useAuth(); // 로그인된 사용자 정보 가져오기
  const userId = user?.id; // user 객체에서 ID 추출

  // 도서 상세 정보 가져오기
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
        setPrice(data.price || 10000);
      } catch (error) {
        console.error("❌ 도서 정보 가져오기 오류:", error);
      }
    };

    fetchBookDetail();
  }, [isbn]);

  // TossPayments 초기화
  useEffect(() => {
    loadTossPayments(clientKey).then((payments) => setTossPayments(payments));
  }, []);

  // 북마크 상태 확인
  useEffect(() => {
    if (userId && book) {
      checkBookmarkStatus(book.isbn);
    }
  }, [userId, book]);

  // 결제 요청
  const handlePayment = async () => {
    if (!tossPayments || !book) return;

    try {
      await tossPayments.requestPayment("카드", {
        amount: price,
        orderId: `order-${isbn}-${Date.now()}`,
        orderName: book.title || "도서 결제",
        successUrl: window.location.origin + "/payment-success",
        failUrl: window.location.origin + "/payment-fail",
      });
    } catch (error) {
      console.error("❌ 결제 오류:", error);
    }
  };

  // 날짜 선택 핸들러
  const handleDateChange = (date) => {
    setSelectedDate(date);
    const newPrice = date.getDate() % 2 === 0 ? 12000 : 10000;
    setPrice(newPrice);
  };

  // 북마크 토글 (추가/삭제)
  const toggleBookmark = async () => {
    if (!userId) {
      alert("로그인 후 북마크를 추가하세요.");
      return;
    }

    try {
      const url = "http://localhost:5001/api/books/bookmarks";
      const method = isBookmarked ? "DELETE" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, isbn }), // userId를 올바르게 전달
      });

      if (!response.ok) {
        throw new Error(
          `${method === "POST" ? "북마크 추가" : "북마크 제거"} 실패`
        );
      }

      setIsBookmarked(!isBookmarked); // 북마크 상태 갱신
    } catch (error) {
      console.error("❌ 북마크 처리 오류:", error);
    }
  };

  // 북마크 상태 조회
  const checkBookmarkStatus = async (isbn) => {
    if (!userId || !isbn) return;

    try {
      const response = await fetch(
        `http://localhost:5001/api/books/bookmarks/${userId}/${isbn}`
      );
      const data = await response.json();
      setIsBookmarked(data.isBookmarked);
    } catch (error) {
      console.error("❌ 북마크 상태 조회 오류:", error);
    }
  };

  // 로딩 상태 처리
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
          <p>
            <strong>선택한 날짜:</strong> {selectedDate.toDateString()}
          </p>
          <p>
            <strong>가격:</strong> {price ? `${price}원` : "가격 정보 없음"}
          </p>
        </div>

        <button className="bookmark-button" onClick={toggleBookmark}>
          {isBookmarked ? (
            <FaBookmark style={{ color: "#ffd700" }} />
          ) : (
            <FaRegBookmark style={{ color: "#ddd" }} />
          )}
          {isBookmarked ? "북마크됨" : "북마크 추가"}
        </button>

        <button className="pay-button" onClick={handlePayment}>
          결제하기
        </button>
      </div>
    </div>
  );
};

export default BookDetail;
