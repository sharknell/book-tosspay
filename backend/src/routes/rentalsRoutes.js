// Express Router
const express = require("express");
const router = express.Router();
const db = require("../config/db"); // Sequelize 또는 MySQL 연결 모듈

// POST /api/rentals
router.post("/", async (req, res) => {
  const { userId, email, bookId, title, from, to, price, orderId } = req.body;

  try {
    await db.query(
      "INSERT INTO rentals (user_id, email, book_id, title, rent_from, rent_to, price, order_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [userId, email, bookId, title, from, to, price, orderId]
    );

    res.status(201).json({ message: "대여 정보 저장 완료!" });
  } catch (error) {
    console.error("❌ DB 저장 오류:", error);
    res.status(500).json({ message: "DB 저장 실패" });
  }
});

module.exports = router;
