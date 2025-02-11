// /src/routes/bookRoutes.js
const express = require("express");
const router = express.Router();
const bookService = require("../services/bookService");

// 책 검색 API
router.get("/", async (req, res) => {
  const query = req.query.query || ""; // query 파라미터 가져오기
  try {
    const data = await bookService.searchBooks(query);
    res.json(data); // 클라이언트에 데이터 응답
  } catch (error) {
    console.error("Error in book search:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
