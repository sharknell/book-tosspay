const axios = require("axios");
const db = require("../config/db"); // MySQL 연결
require("dotenv").config();

const KAKAO_API_KEY = process.env.KAKAO_API_KEY;

// 📚 카카오 도서 검색 API 호출 및 데이터 저장
const searchBooks = async (query) => {
  try {
    const response = await axios.get("https://dapi.kakao.com/v3/search/book", {
      headers: {
        Authorization: `KakaoAK ${KAKAO_API_KEY}`,
      },
      params: {
        query: query,
        size: 1000, // 검색 결과 최대 10개
      },
    });

    const books = response.data.documents || [];

    for (const book of books) {
      await saveBookToDB(book);
    }

    return books;
  } catch (error) {
    console.error("❌ 카카오 API 오류:", error.message);
    return [];
  }
};

const saveBookToDB = async (book) => {
  try {
    const {
      title,
      authors,
      publisher,
      datetime,
      isbn,
      thumbnail: cover_image,
    } = book;

    const cleanedIsbn = isbn ? isbn.trim() : null;

    // 🔥 중복 체크 (ISBN 기준, 없으면 제목 + 출판사 기준)
    const [existingBook] = await db.query(
      "SELECT id FROM books WHERE isbn = ? OR (title = ? AND publisher = ?)",
      [cleanedIsbn, title, publisher]
    );

    if (existingBook.length === 0) {
      console.log(`📚 책 저장 중: ${title}`);

      await db.query(
        `INSERT INTO books (kakao_id, title, author, publisher, published_date, isbn, cover_image) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          cleanedIsbn || null,
          title,
          authors.join(", "), // 🔥 배열을 문자열로 변환
          publisher,
          datetime ? datetime.split("T")[0] : null,
          cleanedIsbn,
          cover_image,
        ]
      );

      console.log(`✅ 저장 완료: ${title}`);
    } else {
      console.log(`⚠️ 이미 존재하는 책: ${title}`);
    }
  } catch (error) {
    console.error("❌ DB 저장 오류:", error.sqlMessage || error.message);
  }
};

module.exports = {
  searchBooks,
};
