import React from "react";
import "../../styles/BooksTable.css"; // CSS 파일을 import

const BooksTable = ({ books }) => {
  return (
    <div>
      <h2>Books Table</h2>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Author</th>
              <th>콘텐츠</th>
              <th>출판사</th>
              <th>출판일</th>
              <th>번역가</th>
              <th>Price</th>
              <th>할인된 가격</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td>{book.id}</td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.contents}</td>
                <td>{book.publisher}</td>
                <td>{book.published_date}</td>
                <td>{book.translator}</td>
                <td>{book.price}</td>
                <td>{book.sale_price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BooksTable;
