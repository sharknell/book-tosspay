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

// 결제 실패 기록용
router.post("/fail", async (req, res) => {
  try {
    const { reason, orderId, userId } = req.body;

    // 선택: 실패 로그 테이블 만들었을 경우
    await pool.query(
      "INSERT INTO payment_failures (user_id, order_id, reason) VALUES (?, ?, ?)",
      [userId || null, orderId || null, reason || "Unknown"]
    );

    res.status(200).json({ message: "❌ 결제 실패 기록 완료" });
  } catch (error) {
    console.error("❌ 결제 실패 기록 오류:", error);
    res.status(500).json({ message: "서버 오류로 실패 기록에 실패했습니다." });
  }
});

module.exports = router;
