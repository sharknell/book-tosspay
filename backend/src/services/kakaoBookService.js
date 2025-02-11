const axios = require("axios");
require("dotenv").config();

// 카카오 API 키 가져오기
const KAKAO_API_KEY = process.env.KAKAO_API_KEY;

// 카카오 도서 검색 API 호출
const searchBooks = async (query) => {
  try {
    const response = await axios.get("https://dapi.kakao.com/v3/search/book", {
      headers: {
        Authorization: `KakaoAK ${KAKAO_API_KEY}`,
      },
      params: {
        query: query,
        size: 10, // 검색 결과 최대 10개
      },
    });
    return response.data.documents; // 검색된 책들
  } catch (error) {
    console.error("카카오 API 오류:", error);
    return [];
  }
};

module.exports = {
  searchBooks,
};
