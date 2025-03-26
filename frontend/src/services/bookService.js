// bookService.js
import axios from "axios"; // axios 사용 예시 (혹은 fetch 사용)
const API_URL = "http://localhost:5001/api/books"; // 서버 주소
// 도서 목록을 가져오는 함수
export const getBooks = async (query, category, sortBy) => {
  try {
    const response = await axios.get(
      `http://localhost:5001/api/books/search?query=${query}&category=${category}&sort=${sortBy}`
    );
    console.log("API 응답 데이터:", response.data); // 응답 데이터 확인
    return response.data;
  } catch (error) {
    console.error("서버에서 데이터를 가져오는 데 오류가 발생했습니다.", error);
    return []; // 오류가 발생하면 빈 배열 반환
  }
};
// bookService.js
export const getBookByIsbn = async (isbn) => {
  const response = await fetch(`/api/book/${isbn}`);
  if (!response.ok) {
    throw new Error("Failed to fetch book details");
  }
  const data = await response.json();
  return data;
};
