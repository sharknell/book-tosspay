const express = require("express");
const { searchBooks } = require("../services/bookService");

const router = express.Router();

router.get("/search", async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ message: "검색어를 입력하세요." });

  try {
    const books = await searchBooks(query);
    res.json({ books });
  } catch (error) {
    console.error("도서 검색 오류:", error);
    res.status(500).json({ message: "도서 검색 실패" });
  }
});

module.exports = router;
