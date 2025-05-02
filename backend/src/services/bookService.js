const axios = require("axios");
const db = require("../config/db");
require("dotenv").config();

const KAKAO_API_KEY = process.env.KAKAO_API_KEY;

const fetchAllBooks = async () => {
  let allBooks = [];
  let page = 1;
  const size = 50;
  const isbnSet = new Set();

  try {
    while (true) {
      const response = await axios.get(
        "https://dapi.kakao.com/v3/search/book",
        {
          headers: { Authorization: `KakaoAK ${KAKAO_API_KEY}` },
          params: { query: "책", size, page },
        }
      );

      const books = response.data.documents || [];
      // 각 책의 contents 확인
      books.forEach((book) => {});
      if (books.length === 0) break;

      const uniqueBooks = books.filter((book) => {
        const cleanedIsbn = book.isbn ? book.isbn.trim() : "";
        if (!isbnSet.has(cleanedIsbn)) {
          isbnSet.add(cleanedIsbn);
          book.isbn = cleanedIsbn; // 책 객체 내부도 정제
          return true;
        }
        return false;
      });

      if (uniqueBooks.length === 0) break;

      allBooks = [...allBooks, ...uniqueBooks];
      page++;
    }
  } catch (error) {
    console.error("❌ 카카오 API 오류:", error.message);
  }

  return allBooks;
};

const initializeBooks = async () => {
  try {
    console.log("⏳ 카카오 API에서 도서 목록을 불러오는 중...");

    const books = await fetchAllBooks();
    console.log(`📚 총 ${books.length}권의 도서를 가져왔습니다.`);

    let insertedCount = 0;

    for (const book of books) {
      const saved = await saveBookToDB(book);
      if (saved) insertedCount++;
    }

    console.log(
      `✅ 총 ${insertedCount}권의 도서가 데이터베이스에 저장되었습니다.`
    );
  } catch (error) {
    console.error("❌ 도서 저장 오류:", error.message);
  }
};

const saveBookToDB = async (book) => {
  try {
    const {
      title,
      authors,
      publisher,
      datetime: published_date,
      isbn,
      thumbnail: cover_image,
      contents, // contents 가져오기
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
      // contents가 없으면 빈 문자열로 처리
      const bookContents = contents || "";

      await db.query(
        `INSERT INTO books (title, author, publisher, published_date, isbn, cover_image, contents, translators, price, sale_price) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          title,
          authors.join(", "), // 🔥 배열을 문자열로 변환
          publisher,
          published_date,
          cleanedIsbn,
          cover_image,
          bookContents, // contents를 빈 문자열로 처리
          translators ? translators.join(", ") : null, // translators 배열을 문자열로 변환
          price || null, // 가격 정보 추가
          sale_price || null, // 세일 가격 정보 추가
        ]
      );

      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("❌ DB 저장 오류:", error.sqlMessage || error.message);
    return false;
  }
};

const searchBooks = async (query) => {
  try {
    const sql = `
      SELECT id, isbn, title, author, publisher, cover_image AS thumbnail, published_date AS datetime
      FROM books
      WHERE title LIKE ? OR author LIKE ? OR publisher LIKE ?
      ORDER BY id DESC
      LIMIT 50
    `;
    const [rows] = await db.execute(sql, [
      `%${query}%`,
      `%${query}%`,
      `%${query}%`,
    ]);
    return rows;
  } catch (error) {
    console.error("❌ DB 검색 오류:", error.message);
    return [];
  }
};

module.exports = { initializeBooks, searchBooks };
