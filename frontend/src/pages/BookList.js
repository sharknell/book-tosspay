import React, { useEffect, useState } from "react";

const BookList = () => {
  const [books, setBooks] = useState([]); // 초기값을 빈 배열로 설정
  const [loading, setLoading] = useState(true); // 데이터 로딩 상태를 추적
  const [error, setError] = useState(null); // 에러 상태를 추적

  useEffect(() => {
    fetch("http://localhost:5001/api/books?query=javascript")
      .then((response) => response.json())
      .then((data) => {
        setBooks(data.documents || []); // data.documents가 없으면 빈 배열로 설정
        setLoading(false); // 로딩 완료
        console.log(data); // 응답 데이터 확인
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
        setError("도서 데이터를 가져오는 데 실패했습니다."); // 에러 메시지 설정
        setLoading(false); // 로딩 종료
      });
  }, []);

  if (loading) {
    return <div>로딩 중...</div>; // 로딩 중일 때 보여줄 메시지
  }

  if (error) {
    return <div>{error}</div>; // 에러가 발생하면 에러 메시지를 출력
  }

  return (
    <div>
      <h1>도서 목록</h1>
      <ul>
        {Array.isArray(books) && books.length > 0 ? (
          books.map((book, index) => (
            <li key={index}>
              <h3>{book.title}</h3>
              <p>{book.contents}</p> {/* 책 설명을 추가할 수 있습니다 */}
              <img src={book.thumbnail} alt={book.title} /> {/* 책 이미지 */}
              <a href={book.url} target="_blank" rel="noopener noreferrer">
                자세히 보기
              </a>
            </li>
          ))
        ) : (
          <li>결과가 없습니다.</li> // 검색 결과가 없을 때 메시지 출력
        )}
      </ul>
    </div>
  );
};

export default BookList;
