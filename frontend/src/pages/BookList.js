import React, { useState, useEffect } from "react";
import { getBooks } from "../services/bookService";
import BookItem from "./BookItem";
import { useAuth } from "../context/authContext";
import "../styles/BookList.css"; // CSS 파일 import

const BookList = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]); // 전체 도서 데이터를 저장
  const [displayedBooks, setDisplayedBooks] = useState([]); // 현재 페이지에 표시할 도서 목록
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState(""); // 검색어 기본값은 빈 문자열
  const [page, setPage] = useState(1);
  const booksPerPage = 8;

  useEffect(() => {
    fetchBooks(query); // 검색어에 맞춰 도서 목록 한 번에 로드
  }, [query]);

  const fetchBooks = (searchQuery) => {
    setLoading(true);
    getBooks(searchQuery, 1, 100) // 100개 이상의 데이터를 한 번에 가져옴
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setBooks(data);
          setDisplayedBooks(data.slice(0, booksPerPage)); // 첫 페이지 데이터 설정
        } else {
          setBooks([]);
          setDisplayedBooks([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
        setError("도서 데이터를 가져오는 데 실패했습니다.");
        setLoading(false);
      });
  };

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1); // 페이지를 첫 페이지로 리셋
    fetchBooks(query); // 검색어로 도서 목록 로드
  };

  const handleNextPage = () => {
    setPage((prevPage) => {
      const newPage = prevPage + 1;
      setDisplayedBooks(
        books.slice(
          newPage * booksPerPage - booksPerPage,
          newPage * booksPerPage
        )
      );
      return newPage;
    });
  };

  const handlePrevPage = () => {
    setPage((prevPage) => {
      const newPage = Math.max(prevPage - 1, 1);
      setDisplayedBooks(
        books.slice(
          newPage * booksPerPage - booksPerPage,
          newPage * booksPerPage
        )
      );
      return newPage;
    });
  };

  return (
    <div className="container">
      <h1>도서 목록</h1>
      <form className="search-form" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          value={query}
          className="search-input"
          onChange={handleSearchChange}
          placeholder="책을 검색하세요..."
        />
        <button type="submit" className="search-button">
          검색
        </button>
      </form>

      {/* 로딩 상태 */}
      {loading && <div>로딩 중...</div>}
      {error && <div>{error}</div>}

      {/* 도서 목록 */}
      <ul>
        <div className="book-grid">
          {displayedBooks.length > 0 ? (
            displayedBooks.map((book) => <BookItem key={book.id} book={book} />)
          ) : (
            <p>결과가 없습니다.</p>
          )}
        </div>
      </ul>

      <div className="pagination">
        <button onClick={handlePrevPage} disabled={page === 1}>
          이전
        </button>
        <span>{page}</span>
        <button
          onClick={handleNextPage}
          disabled={page * booksPerPage >= books.length}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default BookList;
