import React, { useState, useEffect } from "react";
import { getBooks } from "../services/bookService";
import BookItem from "./BookItem";

const BookList = ({ user }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("인기 도서");
  console.log("BookList에서 전달된 user:", user);
  useEffect(() => {
    fetchBooks(query);
  }, [query]);

  const fetchBooks = (searchQuery) => {
    setLoading(true);
    getBooks(searchQuery)
      .then((data) => {
        setBooks(data.documents || []);
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

  return (
    <div className="container">
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

      {loading && <div>로딩 중...</div>}
      {error && <div>{error}</div>}

      <ul>
        {books.length > 0 ? (
          books.map((book, index) => (
            <BookItem key={index} book={book} user={user} />
          ))
        ) : (
          <li>결과가 없습니다.</li>
        )}
      </ul>
    </div>
  );
};

export default BookList;
