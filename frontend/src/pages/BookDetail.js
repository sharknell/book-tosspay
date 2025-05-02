import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaBookmark, FaRegBookmark } from "react-icons/fa";
import { DayPicker } from "react-day-picker";
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

  const MAX_RENT_DAYS = 31;

  useEffect(() => {
    dispatch(fetchBookDetail(id));
    if (user?.id) {
      dispatch(fetchBookmarkStatus({ userId: user.id, id }));
    }
  }, [dispatch, id, user]);

  const handleRequireLogin = () => {
    toast.warn("로그인 후 이용해주세요. 5초 후 로그인 페이지로 이동합니다.");
    setTimeout(() => navigate("/login"), 5000);
  };

  const handleBookmarkToggle = () => {
    if (!user) {
      handleRequireLogin();
      return;
    }
    dispatch(toggleBookmark({ userId: user.id, id, isBookmarked }));
    toast.success(isBookmarked ? "북마크 제거됨" : "북마크 추가됨");
  };

  const handleDateSelection = (range) => {
    // range가 정의되지 않았을 경우를 처리
    if (!range || !range.from) {
      dispatch(setRentalPeriod({ from: null, to: null }));
      return;
    }

    // 두 날짜가 동일한 경우, 'from'만 설정하고 'to'는 null로 설정
    if (range.from && range.to && range.from.getTime() === range.to.getTime()) {
      dispatch(setRentalPeriod({ from: range.from, to: null }));
    } else {
      dispatch(setRentalPeriod(range));
    }
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
        bookId: book.id,
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
        console.error("결제 실패:", error);
        toast.error("결제에 실패했습니다.");
      }
    } else {
      toast.warning("대여 기간을 먼저 선택해주세요.");
    }
  };

  if (loading)
    return <div className="book-detail__loading">책 정보를 불러오는 중...</div>;
  if (error) return <div className="book-detail__error">{error}</div>;

  return (
    <div className="book-detail">
      <ToastContainer position="top-center" />
      <button onClick={() => navigate("/books-list")} className="back-button">
        <FaArrowLeft /> 뒤로가기
      </button>

      {book && (
        <>
          <h1 className="book-title">{book.title}</h1>
          <button className="bookmark-button" onClick={handleBookmarkToggle}>
            {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
            {isBookmarked ? "북마크 해제" : "북마크 추가"}
          </button>
          <div className="book-content">
            <img
              src={book.cover_image || "/default-thumbnail.jpg"}
              alt={book.title}
              className="book-image"
            />

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
                <strong>가격:</strong>{" "}
                {book.sale_price && book.sale_price < book.price ? (
                  <>
                    <span className="original-price">
                      {book.price.toLocaleString()}원
                    </span>{" "}
                    <span className="sale-price">
                      {book.sale_price.toLocaleString()}원
                    </span>
                  </>
                ) : (
                  <>{book.price.toLocaleString()}원</>
                )}
              </p>

              <p>
                <strong>내용 : {book.contents || "정보 없음"}</strong>
              </p>
            </div>
          </div>

          <div className="date-picker-section">
            <p>
              <strong>대여 기간 선택 (최대 {MAX_RENT_DAYS}일):</strong>
            </p>
            <div className="date-picker-content">
              <DayPicker
                className="custom-day-picker"
                mode="range"
                selected={selectedRange}
                onSelect={handleDateSelection}
                disabled={{
                  before: new Date(),
                  after: addDays(new Date(), MAX_RENT_DAYS),
                }}
              />

              {/* 오른쪽 정보 영역 */}
              <div className="rental-summary">
                {selectedRange.from && (
                  <>
                    <p>
                      📅 <strong>시작일:</strong>{" "}
                      {format(selectedRange.from, "yyyy-MM-dd")}
                    </p>
                  </>
                )}
                {selectedRange.to && (
                  <>
                    <p>
                      📅 <strong>종료일:</strong>{" "}
                      {format(selectedRange.to, "yyyy-MM-dd")}
                    </p>
                    <p>
                      ⏳ <strong>총 대여일수:</strong>{" "}
                      {Math.ceil(
                        (selectedRange.to - selectedRange.from) /
                          (1000 * 60 * 60 * 24)
                      ) + 1}{" "}
                      일
                    </p>
                  </>
                )}
                <p>
                  💰 <strong>대여 가격:</strong> {price.toLocaleString()}원
                </p>
              </div>
            </div>
          </div>

          <p className="book-price">대여 가격: {price.toLocaleString()}원</p>

          <button
            className="rent-button"
            onClick={handleRent}
            disabled={!selectedRange.from || !selectedRange.to}
          >
            대여하기 (결제)
          </button>
        </>
      )}
    </div>
  );
};

export default BookDetail;
