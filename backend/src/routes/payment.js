const express = require("express");
const router = express.Router();
const db = require("../config/db");

// POST /payment/success
router.post("/success", async (req, res) => {
  const { userId, isbn, title, price, from, to, orderId } = req.body;

  if (!userId || !isbn || !from || !to || !orderId) {
    return res.status(400).json({ success: false, message: "필수 정보 누락" });
  }

  try {
    await db.query(
      "INSERT INTO rentals (user_id, isbn, title, price, rental_start, rental_end, order_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [userId, isbn, title, price, from, to, orderId]
    );
    res.json({ success: true, message: "대여 저장 완료" });
  } catch (error) {
    console.error("❌ 대여 저장 실패:", error);
    res.status(500).json({ success: false, message: "서버 오류" });
  }
});

// GET /payment/fail
router.get("/fail", (req, res) => {
  res.status(200).json({ success: false, message: "결제 실패" });
});

module.exports = router;
