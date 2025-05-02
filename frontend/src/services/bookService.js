// bookService.js
import axios from "axios"; // axios 사용 예시 (혹은 fetch 사용)
const API_URL = "http://localhost:5001/api/books"; // 서버 주소
// 도서 목록을 가져오는 함수
// bookService.js
export const getBooks = async (query = "", page = 1, limit = 8) => {
  try {
    const params = {};

    // query가 있을 때만 쿼리 파라미터에 추가
    if (query.trim() !== "") {
      params.query = query.trim();
    }

    // 페이지네이션 파라미터 추가
    params.page = page;
    params.limit = limit;

    const response = await axios.get(`${API_URL}/search`, { params });
    console.log("API 응답 데이터:", response.data);
    return response.data;
  } catch (error) {
    console.error("서버에서 데이터를 가져오는 데 오류가 발생했습니다.", error);
    return [];
  }
};

export const getBookByIsbn = async (isbn) => {
  try {
    const response = await fetch(`/api/books/${isbn}`); // 서버의 해당 URL을 호출
    if (!response.ok) {
      throw new Error("책 정보를 가져오는 데 실패했습니다.");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("책 정보 오류:", error);
    throw error;
  }
};
