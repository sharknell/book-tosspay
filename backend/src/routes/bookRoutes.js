const express = require("express");
const { searchBooks } = require("../services/bookService");
const db = require("../config/db");

const router = express.Router();

// 📌 1️⃣ 도서 검색 API
router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: "검색어를 입력하세요." });

    const books = await searchBooks(query);
    res.json(books);
  } catch (error) {
    console.error("❌ 검색 API 오류:", error.message);
    res.status(500).json({ error: "검색 중 오류 발생" });
  }
});

router.get("/books/:isbn", async (req, res) => {
  const { isbn } = req.params;
  const decodedIsbn = decodeURIComponent(isbn); // URL 디코딩

  console.log(`📌 디코딩된 ISBN: ${decodedIsbn}`); // 디코딩된 ISBN 확인

  try {
    const query = `SELECT * FROM books WHERE isbn = ? LIMIT 1`;
    const [rows] = await db.execute(query, [decodedIsbn]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "책 정보를 찾을 수 없습니다." });
    }

    res.json(rows[0]); // 책 정보 반환
  } catch (error) {
    console.error("❌ 책 정보 가져오기 오류:", error);
    res.status(500).json({ error: "서버 오류" });
  }
});

// 📌 3️⃣ 도서 대여 상태 확인 API
router.get("/book/:id/is-rented", async (req, res) => {
  const { id } = req.params;

  try {
    const query = `SELECT is_rented FROM books WHERE id = ?`;
    const [rows] = await db.execute(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "도서를 찾을 수 없습니다." });
    }

    res.json({ isRented: rows[0].is_rented });
  } catch (error) {
    console.error("❌ 대여 상태 확인 오류:", error);
    res.status(500).json({ error: "서버 오류" });
  }
});

module.exports = router;
