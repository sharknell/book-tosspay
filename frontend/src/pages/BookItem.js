import React from "react";

const BookItem = ({ book }) => {
  return (
    <li>
      <h3>{book.title}</h3>
      <p>{book.contents}</p> {/* 책 설명을 추가할 수 있습니다 */}
      <img src={book.thumbnail} alt={book.title} /> {/* 책 이미지 */}
      <a href={book.url} target="_blank" rel="noopener noreferrer">
        자세히 보기
      </a>
    </li>
  );
};

export default BookItem;
