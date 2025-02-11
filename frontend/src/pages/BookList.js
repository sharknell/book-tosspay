import React, { useEffect, useState } from "react";
import { getBooks } from "../services/bookService";
import BookItem from "./BookItem"; // 개별 도서 항목 컴포넌트

const BookList = () => {
  const [books, setBooks] = useState([]); // 도서 목록 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [query, setQuery] = useState(""); // 검색어 상태

  const handleSearchChange = (e) => {
    setQuery(e.target.value); // 검색어 업데이트
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault(); // 폼 제출 시 페이지 리로드 방지
    fetchBooks(query); // 검색어로 도서 목록 가져오기
  };

  const fetchBooks = (searchQuery) => {
    setLoading(true); // 로딩 시작
    getBooks(searchQuery)
      .then((data) => {
        setBooks(data.documents || []); // 도서 목록 업데이트
        setLoading(false); // 로딩 완료
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
        setError("도서 데이터를 가져오는 데 실패했습니다."); // 에러 메시지
        setLoading(false); // 로딩 종료
      });
  };

  useEffect(() => {
    if (query === "") {
      return; // 검색어가 비어 있으면 초기 로딩 상태 유지
    }
    fetchBooks(query); // 검색어로 도서 목록 가져오기
  }, [query]);

  if (error) {
    return <div>{error}</div>; // 에러가 발생하면 에러 메시지 출력
  }

  return (
    <div>
      <h1>도서 목록</h1>
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          value={query}
          onChange={handleSearchChange}
          placeholder="책을 검색하세요..."
        />
        <button type="submit">검색</button>
      </form>

      <ul>
        {Array.isArray(books) && books.length > 0 ? (
          books.map((book, index) => (
            <BookItem key={index} book={book} /> // BookItem 컴포넌트 사용
          ))
        ) : (
          <li>결과가 없습니다.</li> // 검색 결과가 없을 때 메시지 출력
        )}
      </ul>
    </div>
  );
};

export default BookList;
