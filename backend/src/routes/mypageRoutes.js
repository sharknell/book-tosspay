const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { authenticateToken } = require("../middleware/authMiddleware");

// ✅ 사용자 정보 조회
router.get("/user", authenticateToken, async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT id, username, email FROM users WHERE id = ?",
      [req.user.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    res.json(users[0]);
  } catch (error) {
    console.error("사용자 정보 가져오기 오류:", error);
    res.status(500).json({ message: "서버 오류" });
  }
});

// ✅ 사용자 대여 내역 조회
router.get("/rentals/history/:userId", authenticateToken, async (req, res) => {
  const { userId } = req.params;

  // 요청하는 유저와 토큰 유저가 동일한지 확인 (보안)
  if (parseInt(userId) !== req.user.userId) {
    return res.status(403).json({ message: "접근 권한이 없습니다." });
  }

  try {
    const [rows] = await db.query(
      `SELECT id, isbn, title, price, rental_start, rental_end, order_id, created_at 
       FROM rentals 
       WHERE user_id = ? 
       ORDER BY rental_start DESC`,
      [userId]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error("❌ 대여 내역 조회 실패:", error);
    res.status(500).json({ message: "대여 내역을 불러오지 못했습니다." });
  }
});

module.exports = router;
