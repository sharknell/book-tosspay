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
        size: 3, // 결과 3개로 제한
      },
    });

    const books = response.data.documents || [];

    // API에서 받아온 전체 책 데이터 출력
    console.log("API에서 받아온 책 데이터:", books);

    // 데이터가 있는지 확인
    if (books.length === 0) {
      console.log("❌ 책 데이터가 없습니다.");
    }

    // 첫 3개의 책을 콘솔에 출력
    books.slice(0, 3).forEach((book, index) => {
      console.log(`📚 책 ${index + 1}:`);
      console.log(`- 제목: ${book.title}`);
      console.log(`- 저자: ${book.authors}`);
      console.log(`- 출판사: ${book.publisher}`);
      console.log(`- 가격: ${book.price}`);
      console.log(`- 썸네일: ${book.thumbnail}`);
      console.log("-----");
    });

    // 데이터베이스에 책 저장
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
      contents,
      translators,
      price,
      sale_price,
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
        `INSERT INTO books (kakao_id, title, author, publisher, published_date, isbn, cover_image, contents, translators, price, sale_price) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          cleanedIsbn || null,
          title,
          authors.join(", "), // 🔥 배열을 문자열로 변환
          publisher,
          datetime ? datetime.split("T")[0] : null,
          cleanedIsbn,
          cover_image,
          contents || null,
          translators ? translators.join(", ") : null, // 🔥 배열을 문자열로 변환
          price || null,
          sale_price || null,
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
