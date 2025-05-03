const express = require("express");
const router = express.Router();
const db = require("../config/db");
// POST /api/rentals
router.post("/", async (req, res) => {
  const { userId, email, bookId, title, from, to, price, orderId, address } =
    req.body;

  if (
    !userId ||
    !email ||
    !bookId ||
    !title ||
    !from ||
    !to ||
    !price ||
    !orderId ||
    !address
  ) {
    return res.status(400).json({ message: "필수 정보 누락" });
  }

  try {
    await db.query(
      `INSERT INTO rentals 
        (user_id, email, book_id, title, rental_start, rental_end, price, order_id, address, returned)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, email, bookId, title, from, to, price, orderId, address, false]
    );

    res.status(201).json({ message: "대여 정보 저장 완료!" });
  } catch (error) {
    console.error("❌ DB 저장 오류:", error);
    res.status(500).json({ message: "DB 저장 실패" });
  }
});

module.exports = router;
