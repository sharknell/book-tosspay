import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaBookmark, FaRegBookmark } from "react-icons/fa";
import { DayPicker, Nav } from "react-day-picker";
import { format, addDays } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { fetchBookDetail } from "../redux/slices/bookSlice";
import {
  fetchBookmarkStatus,
  toggleBookmark,
} from "../redux/slices/bookmarkSlice";
import { setRentalPeriod } from "../redux/slices/rentalSlice";
import { toast, ToastContainer } from "react-toastify";
import { loadTossPayments } from "@tosspayments/payment-sdk";
import { useAuth } from "../context/authContext";

import "react-toastify/dist/ReactToastify.css";
import "react-day-picker/dist/style.css";
import "../styles/BookDetail.css";

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();

  const { book, loading, error } = useSelector((state) => state.book);
  const { isBookmarked } = useSelector((state) => state.bookmark);
  const { selectedRange, price } = useSelector((state) => state.rental);

  const MAX_RENT_DAYS = 14;

  useEffect(() => {
    dispatch(fetchBookDetail(id));
    if (user?.id) {
      dispatch(fetchBookmarkStatus({ userId: user.id, id }));
    }
  }, [dispatch, id, user]);

  const handleRequireLogin = () => {
    toast.warn(
      "🔐 로그인 후 이용해주세요. 5초 후 로그인 페이지로 이동합니다.",
      {
        autoClose: 3000,
      }
    );
    setTimeout(() => navigate("/login"), 5000);
  };

  const handleBookmarkToggle = () => {
    if (!user) {
      handleRequireLogin();
      return;
    }
    dispatch(toggleBookmark({ userId: user.id, id, isBookmarked }));
    toast.success(
      isBookmarked
        ? "📕 북마크가 제거되었습니다."
        : "📗 북마크에 추가되었습니다.",
      { autoClose: 2000 }
    );
  };

  const handleDateSelection = (range) => {
    if (!range.from) {
      dispatch(setRentalPeriod({ from: null, to: null }));
      return;
    }
    dispatch(setRentalPeriod(range));
  };

  const handleRent = async () => {
    if (!user) {
      handleRequireLogin();
      return;
    }

    if (selectedRange.from && selectedRange.to) {
      const clientKey = "test_ck_pP2YxJ4K87RqyvqEbgjLrRGZwXLO";

      const rentalInfo = {
        userId: user.id,
        email: user.email,
        title: book.title,
        price,
        bookId: book.id, // ← 여기!
        from: format(selectedRange.from, "yyyy-MM-dd"),
        to: format(selectedRange.to, "yyyy-MM-dd"),
        orderId: `order_${Date.now()}`,
      };

      try {
        const tossPayments = await loadTossPayments(clientKey);

        await tossPayments.requestPayment("카드", {
          amount: rentalInfo.price,
          orderId: rentalInfo.orderId,
          orderName: `${rentalInfo.title} 대여`,
          customerName: user.name || "홍길동",
          successUrl: `${
            window.location.origin
          }/payment/success?info=${encodeURIComponent(
            JSON.stringify(rentalInfo)
          )}`,
          failUrl: `${window.location.origin}/payment/fail`,
        });
      } catch (error) {
        console.error("❌ Toss 결제 실패:", error);
        toast.error("❌ 결제에 실패했습니다. 다시 시도해주세요.");
      }
    } else {
      toast.warning("📅 대여 기간을 먼저 선택해주세요.");
    }
  };

  if (loading)
    return <div className="loading">📚 책 정보를 불러오는 중...</div>;
  if (error) return <div className="error">❌ {error}</div>;

  return (
    <div className="book-detail-container">
      <ToastContainer position="top-center" />
      <button
        className="back-button"
        onClick={() => navigate("/books-list")}
        aria-label="뒤로가기"
      >
        <FaArrowLeft /> 뒤로가기
      </button>

      {book && (
        <>
          <h1>{book.title}</h1>
          <img
            src={book.cover_image || "/default-thumbnail.jpg"}
            alt={`${book.title} 표지`}
            className="book-image"
          />

          <button
            className="bookmark-button"
            onClick={handleBookmarkToggle}
            aria-label="북마크 토글"
          >
            {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
            {isBookmarked ? " 북마크 해제" : " 북마크 추가"}
          </button>

          <div className="book-info">
            <p>
              <strong>저자:</strong> {book.author}
            </p>
            <p>
              <strong>출판사:</strong> {book.publisher}
            </p>
            <p>
              <strong>출판일:</strong>{" "}
              {book.published_date?.split("T")[0] || "미상"}
            </p>
            <p>
              <strong>ISBN:</strong> {book.isbn}
            </p>
          </div>

          <div className="date-picker">
            <p>
              <strong>대여 기간 선택:</strong> (최대 {MAX_RENT_DAYS}일)
            </p>
            <DayPicker
              mode="range"
              selected={selectedRange}
              onSelect={handleDateSelection}
              disabled={{
                before: new Date(),
                after: addDays(new Date(), MAX_RENT_DAYS),
              }}
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

          <button
            className="rent-button"
            onClick={handleRent}
            disabled={!selectedRange.from || !selectedRange.to}
            aria-label="대여 결제하기"
          >
            📦 대여하기 (결제)
          </button>
        </>
      )}
    </div>
  );
};

export default BookDetail;
