import React, { useState, useEffect } from "react";
import { getBooks } from "../services/bookService";
import BookItem from "./BookItem";
import { useAuth } from "../context/authContext";
import "./BookList.css";

const BookList = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("인기 도서");
  const [page, setPage] = useState(1);
  const booksPerPage = 5;

  useEffect(() => {
    fetchBooks(query);
  }, [query]);

  const fetchBooks = (searchQuery) => {
    setLoading(true);
    getBooks(searchQuery)
      .then((data) => {
        console.log("📌 저장할 books:", data); // 디버깅 로그 추가
        setBooks(data); // ✅ 배열 그대로 저장
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
    fetchBooks(query);
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

      {loading && <div>로딩 중...</div>}
      {error && <div>{error}</div>}

      <ul>
        {displayedBooks.length > 0 ? (
          displayedBooks.map((book, index) => (
            <BookItem key={index} book={book} user={user} />
          ))
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
