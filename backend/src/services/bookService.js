const axios = require("axios");
const db = require("../config/db");
require("dotenv").config();

const KAKAO_API_KEY = process.env.KAKAO_API_KEY;

const fetchAllBooks = async () => {
  let allBooks = [];
  let page = 1;
  const size = 50; // 카카오 API는 최대 50개씩 요청 가능
  const isbnSet = new Set(); // ISBN 중복 방지용

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
      if (books.length === 0) break; // 더 이상 데이터가 없으면 종료

      // 중복 ISBN 필터링
      const uniqueBooks = books.filter((book) => {
        if (!isbnSet.has(book.isbn)) {
          isbnSet.add(book.isbn);
          return true;
        }
        return false;
      });

      if (uniqueBooks.length === 0) break; // 모두 중복이면 종료

      allBooks = [...allBooks, ...uniqueBooks];
      page++;
    }
  } catch (error) {
    console.error("❌ 카카오 API 오류:", error.message);
  }

  return allBooks;
};

// 📌 데이터베이스에 모든 도서 저장 (중복 방지)
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

// 📌 검색 기능 (카카오 API에서 검색)
const searchBooks = async (query) => {
  try {
    const response = await axios.get("https://dapi.kakao.com/v3/search/book", {
      headers: { Authorization: `KakaoAK ${KAKAO_API_KEY}` },
      params: { query, size: 10 },
    });

    return response.data.documents || [];
  } catch (error) {
    console.error("❌ 도서 검색 오류:", error.message);
    return [];
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
    } = book;

    // console.log(`📝 저장 시도: ${title} (${isbn})`); // 저장 시도 로그

    // 중복 체크
    const [existingBook] = await db.query(
      "SELECT id FROM books WHERE isbn = ? OR (title = ? AND publisher = ?)",
      [isbn, title, publisher]
    );

    if (existingBook.length === 0) {
      const result = await db.query(
        "INSERT INTO books (title, author, publisher, published_date, isbn, cover_image) VALUES (?, ?, ?, ?, ?, ?)",
        [
          title,
          authors.join(", "),
          publisher,
          published_date,
          isbn,
          cover_image,
        ]
      );
      // console.log(`✅ 저장 완료: ${title} (ID: ${result.insertId})`);
      return true;
    } else {
      // console.log(`⚠️ 이미 존재하는 책: ${title}`);
      return false;
    }
  } catch (error) {
    console.error("❌ DB 저장 오류:", error.message);
    return false;
  }
};

module.exports = { initializeBooks, searchBooks };
