import React, { useState, useEffect } from "react";
import { getBooks } from "../services/bookService";
import BookItem from "./BookItem";
import { useAuth } from "../context/authContext";
import "../styles/BookList.css"; // CSS 파일 import

const BookList = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState(""); // 검색어 기본값은 빈 문자열
  const [page, setPage] = useState(1);
  const booksPerPage = 8;

  useEffect(() => {
    fetchBooks(query, page); // ✅ 조건 없이 항상 검색어에 따라 로드
  }, [query, page]);

  const fetchBooks = (searchQuery, currentPage) => {
    setLoading(true);
    getBooks(searchQuery, currentPage, booksPerPage) // 검색어에 맞춰 도서 목록 로드
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setBooks(data);
        } else {
          setBooks([]);
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
    fetchBooks(query, 1); // 검색어로 도서 목록 로드
  };

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const startIndex = (page - 1) * booksPerPage;
  const displayedBooks = books.slice(startIndex, startIndex + booksPerPage);

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
          disabled={startIndex + booksPerPage >= books.length}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default BookList;
