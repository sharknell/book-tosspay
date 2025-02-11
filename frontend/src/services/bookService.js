import axios from "axios";

const API_URL = "http://localhost:5001/api/books";

// 도서 검색 후 결과 반환
export const searchBooks = async (query) => {
  try {
    const response = await axios.post(`${API_URL}/search`, { query });
    return response.data;
  } catch (error) {
    console.error("도서 검색 오류:", error);
    return { error: "도서 검색에 실패했습니다." };
  }
};
