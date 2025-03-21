// backend/services/bookService.js

const axios = require("axios");
const db = require("../config/db"); // MySQL 연결
require("dotenv").config();

const KAKAO_API_KEY = process.env.KAKAO_API_KEY;

// 카카오 API를 통해 도서 검색
const searchBooks = async (query) => {
  try {
    // 카카오 API로 도서 검색
    const response = await axios.get("https://dapi.kakao.com/v3/search/book", {
      headers: {
        Authorization: `KakaoAK ${KAKAO_API_KEY}`,
      },
      params: {
        query: query,
        size: 10, // 최대 10개 검색
      },
    });

    const books = response.data.documents || [];

    // 검색된 도서들을 DB에 저장
    for (const book of books) {
      await saveBookToDB(book);
    }

    return books;
  } catch (error) {
    console.error("❌ 카카오 API 오류:", error.message);
    return [];
  }
};

// 데이터베이스에 도서 저장 함수
const saveBookToDB = async (book) => {
  try {
    // 카카오 API에서 가져오는 데이터에서 필요한 값 추출
    const {
      title,
      authors,
      publisher,
      datetime: published_date,
      isbn,
      thumbnail: cover_image,
    } = book;

    // ISBN이 있으면 ISBN 기준, 없으면 제목 + 출판사 기준으로 중복 체크
    const [existingBook] = await db.query(
      "SELECT id FROM books WHERE isbn = ? OR (title = ? AND publisher = ?)",
      [isbn, title, publisher]
    );

    // 중복된 책이 없으면 데이터베이스에 저장
    if (existingBook.length === 0) {
      await db.query(
        "INSERT INTO books (title, author, publisher, published_date, isbn, cover_image) VALUES (?, ?, ?, ?, ?, ?)",
        [
          title,
          authors.join(", "), // authors는 배열이므로 문자열로 변환
          publisher,
          published_date,
          isbn,
          cover_image,
        ]
      );
      console.log(`📚 책 저장 완료: ${title}`);
    } else {
      console.log(`⚠️ 이미 존재하는 책: ${title}`);
    }
  } catch (error) {
    console.error("❌ DB 저장 오류:", error.message);
  }
};

module.exports = { searchBooks }; // ✅ searchBooks 내보내기
