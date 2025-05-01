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
router.get("/rentals/history/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const [rows] = await db.query(
      `
      SELECT
        order_id,
        title,
      book_id,
        rental_start,
        rental_end,
        price,
        returned -- returned 값 그대로 가져오기
      FROM rentals
      WHERE user_id = ?
      ORDER BY rental_start DESC
      `,
      [userId]
    );

    // rows 반환 전에 반환된 위치를 기준으로 반납 여부를 boolean으로 설정
    const rentalHistory = rows.map((rental) => ({
      ...rental,
      returned: rental.returned ? rental.returned : null, // 반납 장소가 있으면 그 값, 없으면 null
    }));

    res.status(200).json(rentalHistory);
  } catch (error) {
    console.error("❌ 대여 내역 조회 오류:", error);
    res.status(500).json({ message: "대여 내역 조회 실패" });
  }
});

module.exports = router;
