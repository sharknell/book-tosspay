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
import "react-day-picker/dist/style.css";
import "../styles/BookDetail.css";

const BookDetail = () => {
  const { isbn } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { book, loading, error } = useSelector((state) => state.book);
  const { isBookmarked } = useSelector((state) => state.bookmark);
  const { selectedRange, price } = useSelector((state) => state.rental);

  useEffect(() => {
    dispatch(fetchBookDetail(isbn));
    dispatch(fetchBookmarkStatus({ userId: 1, isbn }));
  }, [dispatch, isbn]);

  const handleBookmarkToggle = () => {
    dispatch(toggleBookmark({ userId: 1, isbn, isBookmarked }));
  };

  const handleDateSelection = (range) => {
    if (!range.from) {
      dispatch(setRentalPeriod({ from: null, to: null }));
      return;
    }
    dispatch(setRentalPeriod(range));
  };

  if (loading)
    return <div className="loading">📚 책 정보를 불러오는 중...</div>;
  if (error) return <div className="error">❌ {error}</div>;

  return (
    <div className="book-detail-container">
      <button className="back-button" onClick={() => navigate("/books-list")}>
        <FaArrowLeft /> 뒤로가기
      </button>
      {book && (
        <>
          <h1>{book.title}</h1>
          <img
            src={book.cover_image || "/default-thumbnail.jpg"}
            alt={book.title}
            className="book-image"
          />
          <button className="bookmark-button" onClick={handleBookmarkToggle}>
            {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
            {isBookmarked ? " 북마크 해제" : " 북마크 추가"}
          </button>

          <div className="date-picker">
            <p>
              <strong>대여 기간 선택:</strong> (최대 2주)
            </p>
            <DayPicker
              mode="range"
              selected={selectedRange}
              onSelect={handleDateSelection}
              disabled={{ before: new Date(), after: addDays(new Date(), 14) }}
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
        </>
      )}
    </div>
  );
};

export default BookDetail;
