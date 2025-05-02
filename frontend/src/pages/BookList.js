import React, { useState, useEffect } from "react";
import { getBooks } from "../services/bookService";
import BookItem from "./BookItem";
import { useAuth } from "../context/authContext";
import { Link } from "react-router-dom"; // Import Link
import "../styles/BookList.css"; // CSS 파일 import

const BookList = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState(""); // 검색어 기본값은 빈 문자열
  const [page, setPage] = useState(1);
  const booksPerPage = 5;

  useEffect(() => {
    fetchBooks(query, page); // 검색어만으로 도서 리스트 로드
  }, [query, page]);

  const fetchBooks = (searchQuery, currentPage) => {
    setLoading(true);
    getBooks(searchQuery, currentPage, booksPerPage) // 카테고리, 인기순 정렬 없이 기본 검색어만
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
    fetchBooks(query, 1);
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
        {displayedBooks.length > 0 ? (
          displayedBooks.map((book, i) => {
            return (
              <li key={i}>
                <Link to={`/books-list/${book.id}`}>
                  <BookItem book={book} user={user} />
                </Link>
              </li>
            );
          })
        ) : (
          <li>결과가 없습니다.</li>
        )}
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
