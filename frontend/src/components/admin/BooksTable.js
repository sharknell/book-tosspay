import React, { useState } from "react";
import "../../styles/BooksTable.css";
import { useAuth } from "../../context/authContext";

const BooksTable = ({ books, setBooks }) => {
  const { accessToken } = useAuth(); // 인증 토큰 가져오기
  const [editingBook, setEditingBook] = useState(null);
  const [updatedBook, setUpdatedBook] = useState({
    title: "",
    author: "",
    publisher: "",
    published_date: "",
    translators: "",
    price: "",
    sale_price: "",
  });

  // 날짜 형식 검사 및 변환
  const formatDate = (date) => {
    const formattedDate = new Date(date);
    return formattedDate.toISOString().split("T")[0]; // "2024-10-15" 형식으로 변환
  };

  // 책 수정 폼 데이터 업데이트
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedBook((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 수정 버튼 클릭 시 수정 폼 열기
  const handleEditClick = (book) => {
    setEditingBook(book.id);
    setUpdatedBook({
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      published_date: formatDate(book.published_date), // 날짜 형식 변환
      translators: book.translators,
      price: book.price,
      sale_price: book.sale_price,
    });
  };

  const handleUpdateBook = async () => {
    try {
      console.log("수정 중..."); // 디버깅용 로그
      const response = await fetch(
        `http://localhost:5001/api/admin/books/${editingBook}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // 인증 토큰 추가
          },
          body: JSON.stringify(updatedBook),
        }
      );

      // 서버 응답 상태와 응답 본문 출력
      console.log("서버 응답 상태:", response.status); // 상태 코드 확인
      console.log("서버 응답 텍스트:", response.statusText); // 상태 텍스트 확인

      if (response.ok) {
        // 서버에서 수정된 책 목록을 받아옴
        const updatedBooksResponse = await fetch(
          "http://localhost:5001/api/admin/books",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        // 서버 응답 확인
        const updatedBooks = await updatedBooksResponse.json();
        console.log("업데이트된 책 목록:", updatedBooks); // 디버깅용 로그

        setBooks(updatedBooks); // 업데이트된 책 목록으로 상태 갱신

        // 책 수정이 완료되었음을 알림
        alert("책 수정이 완료되었습니다.");
        setEditingBook(null); // 수정 상태 종료
      } else {
        // 실패 시 오류 메시지 출력
        const errorMessage = await response.text(); // 응답 본문 오류 메시지 확인
        console.error("서버 오류 메시지:", errorMessage);
        alert(`책 수정에 실패했습니다. 서버 오류: ${errorMessage}`);
      }
    } catch (error) {
      console.error("책 수정 오류:", error);
      alert("책 수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="books-table-wrapper">
      <h2>Books Table</h2>
      <div className="scrollable-table-container">
        <table className="books-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Author</th>
              <th>출판사</th>
              <th>출판일</th>
              <th>번역가</th>
              <th>Price</th>
              <th>할인된 가격</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td>{book.id}</td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.publisher}</td>
                <td>{book.published_date || "N/A"}</td>
                <td>{book.translators || "N/A"}</td>
                <td>
                  {typeof book.price === "number"
                    ? `${book.price.toLocaleString()}원`
                    : "가격 없음"}
                </td>
                <td
                  className={
                    typeof book.sale_price === "number" &&
                    book.sale_price < book.price
                      ? "discounted"
                      : ""
                  }
                >
                  {typeof book.sale_price === "number"
                    ? `${book.sale_price.toLocaleString()}원`
                    : "할인 없음"}
                </td>
                <td>
                  <button onClick={() => handleEditClick(book)}>수정</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingBook && (
        <div className="edit-book-form">
          <h3>책 수정</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdateBook();
            }}
          >
            <label>
              제목:
              <input
                type="text"
                name="title"
                value={updatedBook.title}
                onChange={handleInputChange}
              />
            </label>
            <label>
              저자:
              <input
                type="text"
                name="author"
                value={updatedBook.author}
                onChange={handleInputChange}
              />
            </label>
            <label>
              출판사:
              <input
                type="text"
                name="publisher"
                value={updatedBook.publisher}
                onChange={handleInputChange}
              />
            </label>
            <label>
              출판일:
              <input
                type="date"
                name="published_date"
                value={updatedBook.published_date}
                onChange={handleInputChange}
              />
            </label>
            <label>
              번역가:
              <input
                type="text"
                name="translators"
                value={updatedBook.translators}
                onChange={handleInputChange}
              />
            </label>
            <label>
              가격:
              <input
                type="number"
                name="price"
                value={updatedBook.price}
                onChange={handleInputChange}
              />
            </label>
            <label>
              할인된 가격:
              <input
                type="number"
                name="sale_price"
                value={updatedBook.sale_price}
                onChange={handleInputChange}
              />
            </label>
            <button type="submit">수정 완료</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default BooksTable;
