import React, { useState } from "react";
import { searchBooks } from "../services/bookService";

const BookSearchPage = () => {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [message, setMessage] = useState("");

  const handleSearch = async () => {
    if (!query) return;

    const result = await searchBooks(query);
    if (result.message) {
      setMessage(result.message);
      setBooks([]);
    } else {
      setBooks(result);
      setMessage("");
    }
  };

  return (
    <div>
      <h2>🔍 도서 검색</h2>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="책 제목을 입력하세요"
      />
      <button onClick={handleSearch}>검색</button>

      {message && <p>{message}</p>}

      {books.length > 0 && (
        <ul>
          {books.map((book) => (
            <li key={book.isbn}>
              <img src={book.thumbnail} alt={book.title} width={50} />
              <p>
                {book.title} - {book.author}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookSearchPage;
