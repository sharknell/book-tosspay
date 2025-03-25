import axios from "axios"; // axios 사용 예시 (혹은 fetch 사용)

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
