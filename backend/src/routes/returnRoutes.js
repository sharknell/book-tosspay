const express = require("express");
const router = express.Router();
const db = require("../config/db");

// POST /api/return - 반납 처리
router.post("/", async (req, res) => {
  const { order_id, return_location } = req.body;

  if (!order_id || !return_location) {
    return res.status(400).json({ message: "필수 항목이 누락되었습니다." });
  }

  try {
    // rentals 테이블에 반납 위치와 반납일자(rental_end) 저장
    await db.query(
      `UPDATE rentals 
         SET returned = ?,  rental_end = NOW() 
         WHERE order_id = ?`,
      [return_location, order_id]
    );

    console.log(
      `✅ 반납 완료 - order_id: ${order_id}, return_location: ${return_location}`
    );
    res.status(200).json({ message: "반납 처리 완료!" });
  } catch (error) {
    console.error("❌ 반납 처리 오류:", error);
    res.status(500).json({ message: "반납 처리 실패" });
  }
});

router.get("/spots", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM return_spots");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "반납 위치 불러오기 실패" });
  }
});

module.exports = router;
