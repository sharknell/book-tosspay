const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { authenticateToken } = require("../middleware/authMiddleware");

// 📁 routes/mypage.js 또는 해당 라우터 파일
router.get("/user", authenticateToken, async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT id, username, email, role, address, phone FROM users WHERE id = ?",
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

// PATCH /api/mypage/user/address
router.patch("/user/address", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const { address } = req.body;

  if (!address) {
    return res.status(400).json({ message: "주소는 필수 항목입니다." });
  }

  try {
    const [result] = await db.query(
      "UPDATE users SET address = ? WHERE id = ?",
      [address, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    res.json({ message: "주소가 성공적으로 저장되었습니다." });
  } catch (error) {
    console.error("주소 저장 오류:", error);
    res.status(500).json({ message: "서버 오류" });
  }
});

// ✅ 사용자 주소 저장 또는 수정
router.put("/user/address", authenticateToken, async (req, res) => {
  const { address } = req.body;

  if (!address) {
    return res.status(400).json({ message: "주소가 필요합니다." });
  }

  try {
    const [result] = await db.query(
      "UPDATE users SET address = ? WHERE id = ?",
      [address, req.user.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    res.status(200).json({ message: "주소가 성공적으로 업데이트되었습니다." });
  } catch (error) {
    console.error("❌ 주소 저장 오류:", error);
    res.status(500).json({ message: "서버 오류" });
  }
});
// 📁 routes/mypage.js 또는 해당 라우터 파일에 추가

// PATCH /api/mypage/user/phone
router.patch("/user/phone", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: "전화번호는 필수 항목입니다." });
  }

  try {
    const [result] = await db.query("UPDATE users SET phone = ? WHERE id = ?", [
      phone,
      userId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    res.json({ message: "전화번호가 성공적으로 저장되었습니다." });
  } catch (error) {
    console.error("전화번호 저장 오류:", error);
    res.status(500).json({ message: "서버 오류" });
  }
});

// ✅ 사용자 전화번호 저장 또는 수정 (PUT 방식)
router.put("/user/phone", authenticateToken, async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: "전화번호가 필요합니다." });
  }

  try {
    const [result] = await db.query("UPDATE users SET phone = ? WHERE id = ?", [
      phone,
      req.user.userId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    res
      .status(200)
      .json({ message: "전화번호가 성공적으로 업데이트되었습니다." });
  } catch (error) {
    console.error("전화번호 저장 오류:", error);
    res.status(500).json({ message: "서버 오류" });
  }
});

module.exports = router;
