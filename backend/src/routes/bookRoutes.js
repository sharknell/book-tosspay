const express = require("express");
const { searchBooks } = require("../services/bookService");

const router = express.Router();

// 📌 도서 검색 API
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

module.exports = router;
