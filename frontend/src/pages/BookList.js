import React, { useState, useEffect } from "react";
import { getBooks } from "../services/bookService";
import BookItem from "./BookItem";
import { useAuth } from "../context/authContext";
import { Link } from "react-router-dom"; // Import Link
import "./BookList.css";

const BookList = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("인기 도서");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popularity");
  const [page, setPage] = useState(1);
  const booksPerPage = 5;

  useEffect(() => {
    fetchBooks(query, category, sortBy, page);
  }, [query, category, sortBy, page]);

  const fetchBooks = (
    searchQuery,
    searchCategory,
    searchSortBy,
    currentPage
  ) => {
    setLoading(true);
    getBooks(
      searchQuery,
      searchCategory,
      searchSortBy,
      currentPage,
      booksPerPage
    )
      .then((data) => {
        console.log("Fetched data:", data); // 데이터 확인
        if (Array.isArray(data) && data.length > 0) {
          setBooks(data); // 정상적인 데이터일 때
        } else {
          setBooks([]); // 빈 배열로 처리
        }
        setLoading(false); // 로딩 끝
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
        setError("도서 데이터를 가져오는 데 실패했습니다.");
        setLoading(false); // 로딩 끝
      });
  };

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBooks(query, category, sortBy, 1);
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

      {/* 검색 폼 */}
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

      {/* 카테고리와 정렬 필터 */}
      <div className="filters">
        <select
          value={category}
          onChange={handleCategoryChange}
          className="filter-select"
        >
          <option value="all">전체</option>
          <option value="fiction">소설</option>
          <option value="non-fiction">논픽션</option>
        </select>

        <select
          value={sortBy}
          onChange={handleSortChange}
          className="filter-select"
        >
          <option value="popularity">인기순</option>
          <option value="rating">별점순</option>
          <option value="newest">최신순</option>
        </select>
      </div>

      {/* 로딩 상태 */}
      {loading && <div>로딩 중...</div>}
      {error && <div>{error}</div>}

      {/* 도서 목록 */}
      <ul>
        {displayedBooks.length > 0 ? (
          displayedBooks.map((book) => {
            // ISBN이 여러 개로 구성된 경우 첫 번째 값만 사용하도록 변환
            const cleanIsbn = book.isbn.split(" ")[0]; // 공백을 기준으로 첫 번째 값만 추출
            return (
              <li key={cleanIsbn}>
                <Link
                  to={`/books-list/detail/${encodeURIComponent(cleanIsbn)}`}
                >
                  <BookItem book={book} user={user} />
                </Link>
              </li>
            );
          })
        ) : (
          <li>결과가 없습니다.</li>
        )}
      </ul>

      {/* 페이지 네비게이션 */}
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
