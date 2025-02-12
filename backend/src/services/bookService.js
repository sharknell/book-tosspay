// /src/services/bookService.js
const fetch = require("node-fetch");

const searchBooks = async (query) => {
  const response = await fetch(
    `https://dapi.kakao.com/v3/search/book?query=${query}&size=50`, // 최대 50개 가져오기
    {
      headers: {
        Authorization: `KakaoAK ${process.env.KAKAO_API_KEY}`, // .env 파일에서 API 키 가져오기
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch books");
  }

  const data = await response.json();

  return data;
};

module.exports = {
  searchBooks,
};
